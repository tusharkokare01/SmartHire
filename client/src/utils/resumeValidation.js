import { z } from 'zod';

export const resumeSchema = z.object({
    personalInfo: z.object({
        fullName: z.string().min(1, 'Full Name is required'),
        email: z.string().optional().or(z.literal('')), // Allow empty or valid string, strict email valid only if present
        phone: z.string().optional().or(z.literal('')),
        address: z.string().optional(),
        linkedin: z.string().optional().or(z.literal('')),
        github: z.string().optional().or(z.literal('')),
    }),
    profileSummary: z.string().optional(),
    education: z.array(z.object({
        degree: z.string().optional().or(z.literal('')),
        institution: z.string().optional().or(z.literal('')),
        year: z.string().optional(),
        gpa: z.string().optional(),
    })).optional(),
    experience: z.array(z.object({
        title: z.string().optional().or(z.literal('')),
        company: z.string().optional().or(z.literal('')),
        duration: z.string().optional(),
        description: z.string().optional(),
    })).optional(),
    projects: z.array(z.object({
        name: z.string().optional().or(z.literal('')),
        description: z.string().optional(),
        technologies: z.string().optional(),
        link: z.string().optional().or(z.literal('')),
    })).optional(),
    certifications: z.array(z.object({
        name: z.string().optional().or(z.literal('')),
        issuer: z.string().optional().or(z.literal('')),
        year: z.string().optional(),
    })).optional(),
    skills: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    extraSections: z.array(z.object({
        title: z.string(),
        items: z.array(z.string()),
    })).optional(),
});
