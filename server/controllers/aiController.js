import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {prompt, length} = req.body;
        const plan = req.plan;
        const freeUsage = req.free_usage;

        if(plan !== 'premium' && freeUsage >= 10) {
            return res.status(403).json({
                success: false,
                message: 'Free usage limit exceeded. Upgrade to premium for unlimited access.'
            });
        }
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: length,
        });

        const content = response.choices[0].message.content;

        await sql` INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'article')`;

        if(plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: freeUsage + 1
                }
            })
        }

        res.json({
            success: true,
            content: content
        });

    } catch (error) {
        console.error("Error generating article:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });   
    }
}

export const generateBlogTitle = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {prompt} = req.body;
        const plan = req.plan;
        const freeUsage = req.free_usage;

        if(plan !== 'premium' && freeUsage >= 10) {
            return res.status(403).json({
                success: false,
                message: 'Free usage limit exceeded. Upgrade to premium for unlimited access.'
            });
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 100,
        });

        const content = response.choices[0].message.content;

        await sql` INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

        if(plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: freeUsage + 1
                }
            })
        }

        res.json({
            success: true,
            content: content
        });

    } catch (error) {
        console.error("Error generating article:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });   
    }
}

export const generateImage = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {prompt, publish} = req.body;
        const plan = req.plan;

        if(plan !== 'premium') {
            return res.status(403).json({
                success: false,
                message: 'This feature is only available for premium users.'
            });
        }

        const formData = new FormData()
        formData.append('prompt', prompt);
        const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {'x-api-key': process.env.CLIPDROP_API_KEY,},
            responseType: 'arraybuffer',
        })

        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

        const {secure_url} = await cloudinary.uploader.upload(base64Image)

        await sql` INSERT INTO creations (user_id, prompt, content, type, publish)
        VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

        res.json({
            success: true,
            content: secure_url
        });

    } catch (error) {
        console.error("Error generating article:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });   
    }
}

export const removeImageBackground = async (req, res) => {
    try {
        const {userId} = req.auth();
        const image = req.file;
        const plan = req.plan;

        if(plan !== 'premium') {
            return res.status(403).json({
                success: false,
                message: 'This feature is only available for premium users.'
            });
        }

        const {secure_url} = await cloudinary.uploader.upload(image.path, {
            transformation: [
                { 
                    effect: "background_removal",
                    background_removal: "remove_the_background",
                }
            ]
        })

        await sql` INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;

        res.json({
            success: true,
            content: secure_url
        });

    } catch (error) {
        console.error("Error generating article:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });   
    }
}

export const removeImageObject = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {object} = req.body;
        const image = req.file;
        const plan = req.plan;

        if(plan !== 'premium') {
            return res.status(403).json({
                success: false,
                message: 'This feature is only available for premium users.'
            });
        }

        const {secure_url} = await cloudinary.uploader.upload(image.path)

        const imageUrl = cloudinary.url(secure_url, {
            transformation: [
                { 
                    effect: `gen_remove:${object}`
                }
            ],
            resource_type: 'image'
        })

        await sql` INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${`Removed ${object} from Image.`}, ${imageUrl}, 'image')`;

        res.json({
            success: true,
            content: imageUrl
        });

    } catch (error) {
        console.error("Error generating article:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });   
    }
}

export const resumeReview = async (req, res) => {
    try {
        const {userId} = req.auth();
        const resume = req.file;
        const plan = req.plan;

        if(plan !== 'premium') {
            return res.status(403).json({
                success: false,
                message: 'This feature is only available for premium users.'
            });
        }

        if(resume.size > 5*1024*1024){
            return res.status(400).json({
                success: false,
                message: 'Resume file size exceeds the 5MB limit.'
            });
        }

        const dataBuffer = fs.readFileSync(resume.path)
        const pdfData = await pdf(dataBuffer);

        const prompt = `Review the following resume and provide constructive feedback on its strength, weakness , and areas for improvement. The resume content is as follows:\n\n${pdfData.text }`;

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });
        
        const content = response.choices[0].message.content;

        await sql` INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, 'Review the uploadded Resume', ${content}, 'review-resume')`;

        res.json({
            success: true,
            content: content
        });

    } catch (error) {
        console.error("Error generating article:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });   
    }
}

