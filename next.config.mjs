/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "lh3.googleusercontent.com",
            "platform-lookaside.fbsbx.com",
            "images.unsplash.com"
        ],
    },
    
    // Remove the swcMinify option as it's no longer supported in Next.js 15
    
    experimental: {
        optimizePackageImports: ['lucide-react', '@tabler/icons-react'],
    },
};

export default nextConfig;
