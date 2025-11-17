import { EmailTemplate, EmailBlock } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const createBlocks = (blocks: Omit<EmailBlock, 'id'>[]): EmailBlock[] => {
    return blocks.map(b => ({ ...b, id: uuidv4() }));
}

export const emailTemplates: EmailTemplate[] = [
    {
        id: uuidv4(),
        name: 'Simple Welcome',
        style: { bodyBackgroundColor: '#f3f4f6', contentBackgroundColor: '#ffffff' },
        blocks: createBlocks([
            { type: 'header', props: { logoSrc: 'https://via.placeholder.com/150x50/3b82f6/FFFFFF?text=Welcome', textAlign: 'center', paddingY: 20 } },
            { type: 'text', props: { content: "<h1>We're glad to have you!</h1><p>Thanks for signing up. We're excited to share our latest news, tips, and special offers with you. Here's what you can expect from our emails...</p>", paddingX: 24, paddingY: 16 } },
            { type: 'button', props: { text: 'Explore Our Website', href: '#', backgroundColor: '#3b82f6', textColor: '#ffffff', textAlign: 'center' } },
            { type: 'spacer', props: { height: 20 } },
        ])
    },
    {
        id: uuidv4(),
        name: 'Product Announcement',
        style: { bodyBackgroundColor: '#111827', contentBackgroundColor: '#1f2937' },
        blocks: createBlocks([
            { type: 'image', props: { src: 'https://via.placeholder.com/600x300/374151/FFFFFF?text=NEW+PRODUCT' } },
            { type: 'text', props: { content: "<h1 style='color:white;'>Introducing the Future.</h1><p style='color:#d1d5db;'>We've been working hard on something amazing, and we're thrilled to finally share it with you. The new [Product Name] is designed to solve [problem] like never before.</p>", paddingX: 24, paddingY: 16, textAlign: 'center' } },
            { type: 'button', props: { text: 'Learn More & Pre-Order', href: '#', backgroundColor: '#0ea5e9', textColor: '#ffffff', textAlign: 'center' } },
            { type: 'divider', props: { color: '#4b5563', paddingY: 20 } },
            { type: 'text', props: { content: "<p style='color:#9ca3af;font-size:12px;'>Follow us on social media for more updates.</p>", paddingX: 24, paddingY: 0, textAlign: 'center' } },
        ])
    },
    {
        id: uuidv4(),
        name: 'Flash Sale',
        style: { bodyBackgroundColor: '#fef2f2', contentBackgroundColor: '#ffffff' },
        blocks: createBlocks([
             { type: 'header', props: { logoSrc: 'https://via.placeholder.com/150x50/ef4444/FFFFFF?text=SALE!', textAlign: 'center', paddingY: 20 } },
            { type: 'text', props: { content: "<h1 style='color:#b91c1c; text-align:center;'>FLASH SALE! 48 Hours Only</h1><p style='text-align:center;'>Don't walk, RUN! Get an incredible <strong>40% OFF</strong> everything for the next 48 hours. This is a limited-time offer you won't want to miss.</p>", paddingX: 24, paddingY: 16 } },
            { type: 'image', props: { src: 'https://via.placeholder.com/600x200/fee2e2/b91c1c?text=40%25+OFF+EVERYTHING' } },
            { type: 'button', props: { text: 'Shop the Sale Now', href: '#', backgroundColor: '#ef4444', textColor: '#ffffff', textAlign: 'center' } },
        ])
    },
    {
        id: uuidv4(),
        name: 'Blank Canvas',
        style: { bodyBackgroundColor: '#f1f5f9', contentBackgroundColor: '#ffffff' },
        blocks: createBlocks([
            { type: 'text', props: { content: '<h1>Your Email Title</h1><p>Start building your amazing email from scratch!</p>', paddingX: 24, paddingY: 16 } }
        ])
    }
];
