import { PageType, Template, EmailBlock } from '../../types';
import { v4 as uuidv4 } from 'uuid';

type FunnelTemplates = Record<PageType | 'email', Template[]>;

type TemplateData = Omit<Template, 'id' | 'blocks'> & { blocks: Omit<EmailBlock, 'id'>[] };

const createTemplates = (templates: TemplateData[]): Template[] => {
    return templates.map(t => ({ 
        ...t, 
        id: uuidv4(),
        blocks: t.blocks.map(b => ({...b, id: uuidv4()})),
    }));
}

const textBlock = (content: string): Omit<EmailBlock, 'id'> => ({
    type: 'text',
    props: { content, paddingX: 24, paddingY: 16 }
});

export const funnelTemplates: FunnelTemplates = {
    squeeze: createTemplates([
        { name: "Free Guide Opt-In", blocks: [textBlock("<h1>Get Your Free Guide to [Topic]!</h1><p>Enter your email below to get instant access.</p>")] },
        { name: "Webinar Registration", blocks: [textBlock("<h1>Join Our Exclusive Webinar on [Topic]</h1><p>Save your spot now!</p>")] },
        { name: "Newsletter Signup", blocks: [textBlock("<h1>Subscribe to Our Newsletter</h1><p>Get weekly tips and insights delivered to your inbox.</p>")] },
        { name: "Discount Code Offer", blocks: [textBlock("<h1>Unlock 15% Off Your First Order!</h1><p>Sign up to receive your exclusive discount code.</p>")] },
        { name: "Simple Lead Magnet", blocks: [textBlock("<h1>Download the Ultimate [Resource] Checklist</h1><p>Tell us where to send it.</p>")] },
    ]),
    sales: createTemplates([
        { name: "Core Product Sales Page", blocks: [textBlock("<h1>Introducing [Product Name] - The Solution You've Been Waiting For</h1><p>[Detailed benefits, features, testimonials]</p>")] },
        { name: "Video Sales Letter (VSL)", blocks: [textBlock("<h1>[Watch Now] How to Achieve [Result] with [Product]</h1><p>[Video embed and call to action button]</p>")] },
        { name: "Limited Time Offer", blocks: [textBlock("<h1>Special Offer: Get [Product Name] for Just [Price]! (Ends Soon)</h1><p>Don't miss out on this incredible deal.</p>")] },
        { name: "Feature-Benefit Breakdown", blocks: [textBlock("<h1>Why [Product Name] is the #1 Choice for [Target Audience]</h1><p>[Section for each feature and its corresponding benefit]</p>")] },
        { name: "Problem/Agitate/Solve", blocks: [textBlock("<h1>Tired of [Problem]? Here's the Proven Solution.</h1><p>Imagine if you could [desired outcome]...</p>")] },
    ]),
    order: createTemplates([
        { name: "Standard Checkout Form", blocks: [textBlock("<h1>Complete Your Order</h1><p>[Contact Information, Billing Address, Payment Details]</p>")] },
        { name: "Two-Step Order Form", blocks: [textBlock("<h1>Step 1: Shipping Details</h1><p>Where should we send your order?</p>")] },
        { name: "Express Checkout", blocks: [textBlock("<h1>Quick Checkout</h1><p>Confirm your details and complete your purchase.</p>")] },
        { name: "Order Bump Form", blocks: [textBlock("<h1>Yes! Add [Order Bump Product] to My Order for Just [Price]!</h1><p>[Main product details + checkbox for bump]</p>")] },
        { name: "Secure Payment Form", blocks: [textBlock("<h1>Your Information is Safe & Secure</h1><p>[Security badges, payment fields]</p>")] },
    ]),
    upsell: createTemplates([
        { name: "One-Time Offer Upsell", blocks: [textBlock("<h1>WAIT! Your Order is Not Complete...</h1><h2>Add [Upsell Product] for a Special One-Time Price of [Price]!</h2>")] },
        { name: "Upgrade Offer", blocks: [textBlock("<h1>Upgrade to the Deluxe Version of [Product]</h1><p>Get exclusive features and bonuses.</p>")] },
        { name: "Continuity/Subscription", blocks: [textBlock("<h1>Join Our VIP Club!</h1><p>Get monthly access to [resource/product] for a recurring fee.</p>")] },
        { name: "'Done For You' Service", blocks: [textBlock("<h1>Let Us Do the Hard Work For You!</h1><p>Add our professional setup service to your order.</p>")] },
        { name: "More of the Same", blocks: [textBlock("<h1>Get a Second [Product] at 50% Off!</h1><p>Double your results with this exclusive offer.</p>")] },
    ]),
    downsell: createTemplates([
        { name: "Payment Plan Offer", blocks: [textBlock("<h1>No worries! How about 3 easy payments of [Price]?</h1><p>Get started today with a smaller investment.</p>")] },
        { name: "Lite Version Offer", blocks: [textBlock("<h1>Okay, maybe the full package is too much. Try the Lite Version for just [Price]!</h1><p>Includes core features to get you started.</p>")] },
        { name: "Extended Trial", blocks: [textBlock("<h1>Still not sure? Try it risk-free for 30 days!</h1><p>Get full access and decide later.</p>")] },
        { name: "Alternative Product", blocks: [textBlock("<h1>Perhaps [Alternative Product] is a better fit?</h1><p>It helps you achieve [similar goal] for a lower price.</p>")] },
        { name: "Final Discount Offer", blocks: [textBlock("<h1>Final Chance: Take 20% Off!</h1><p>We don't want you to miss out. Use this code now.</p>")] },
    ]),
    thankyou: createTemplates([
        { name: "Simple Thank You & Next Steps", blocks: [textBlock("<h1>Thank You For Your Order!</h1><p>Your receipt has been emailed to you. Here's how to access your purchase...</p>")] },
        { name: "Access Purchase Page", blocks: [textBlock("<h1>Purchase Complete! Access [Product Name] Here.</h1><p>[Link/Button to access content]</p>")] },
        { name: "Offer Unadvertised Bonus", blocks: [textBlock("<h1>Thanks! As a special bonus, here's a free [Bonus Item]</h1><p>We appreciate your business!</p>")] },
        { name: "Request for Social Share", blocks: [textBlock("<h1>Success! Tell your friends about us?</h1><p>Share your excitement and get a [reward].</p>")] },
        { name: "What to Expect", blocks: [textBlock("<h1>Order Confirmed!</h1><p>You can expect your [product/welcome email] within the next 5 minutes.</p>")] },
    ]),
    custom: createTemplates([
        { name: "Blank Custom Page", blocks: [textBlock("<h1>Your Custom Page Title</h1><p>Start building your page from scratch here.</p>")] },
        { name: "Video Content Page", blocks: [textBlock("<h1>[Video Title]</h1><p>[Embed your video here]</p>")] },
        { name: "FAQ Page", blocks: [textBlock("<h1>Frequently Asked Questions</h1><p>[List of Q&A]</p>")] },
        { name: "About Us Page", blocks: [textBlock("<h1>About Our Company</h1><p>[Your company story and mission]</p>")] },
        { name: "Contact Us Page", blocks: [textBlock("<h1>Get In Touch</h1><p>[Contact form or details]</p>")] },
    ]),
    membership: createTemplates([
        { name: "Membership Login", blocks: [textBlock("<h1>Member Login</h1><p>[Username and Password fields]</p>")] },
        { name: "Create Membership Account", blocks: [textBlock("<h1>Create Your Account</h1><p>Set up your username and password to access the members' area.</p>")] },
        { name: "Course Curriculum", blocks: [textBlock("<h1>Welcome to [Course Name]!</h1><p>[List of modules and lessons]</p>")] },
        { name: "Member Dashboard", blocks: [textBlock("<h1>Welcome Back, [Member Name]!</h1><p>[Links to content, community, and account settings]</p>")] },
        { name: "Access Denied Page", blocks: [textBlock("<h1>Access Denied</h1><p>You must be a member to view this content. Please log in or sign up.</p>")] },
    ]),
    optout: createTemplates([
        { name: "Unsubscribe Confirmation", blocks: [textBlock("<h1>You have been unsubscribed.</h1><p>We're sorry to see you go. You will no longer receive emails from us.</p>")] },
        { name: "Manage Email Preferences", blocks: [textBlock("<h1>Manage Your Preferences</h1><p>Don't want to unsubscribe completely? Choose which types of emails you'd like to receive.</p>")] },
        { name: "Pause Subscription", blocks: [textBlock("<h1>Need a break?</h1><p>You can pause notifications for 30 days instead of unsubscribing.</p>")] },
        { name: "Unsubscribe Survey", blocks: [textBlock("<h1>Sorry to see you go!</h1><p>Could you tell us why you're leaving? Your feedback helps us improve.</p>")] },
        { name: "Simple Opt-Out", blocks: [textBlock("<h1>Confirm Unsubscribe</h1><p>Click the button below to confirm you want to opt-out of all future communications.</p>")] },
    ]),
    email: createTemplates([
        { name: "Welcome Email", blocks: [textBlock("Subject: Welcome to [Brand]!\n\nHi [Name],\n\nThanks for joining us! We're excited to have you. Here's what to expect...")] },
        { name: "Content Delivery Email", blocks: [textBlock("Subject: Here's your free [Resource Name]!\n\nHi [Name],\n\nAs promised, here is the [resource] you requested. You can access it here: [Link]")] },
        { name: "Sales Email - Feature Focus", blocks: [textBlock("Subject: Did you know [Product] could do this?\n\nHi [Name],\n\nI wanted to highlight a powerful feature of [Product] that can help you [achieve benefit]...")] },
        { name: "Cart Abandonment", blocks: [textBlock("Subject: Did you forget something?\n\nHi [Name],\n\nIt looks like you left items in your cart. Complete your purchase now before they're gone!\n\n[Link to cart]")] },
        { name: "Relationship Building", blocks: [textBlock("Subject: A quick question for you\n\nHi [Name],\n\nI was just thinking about [topic] and wanted to share a quick tip with you...")] },
    ]),
};