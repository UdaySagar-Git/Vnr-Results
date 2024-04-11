/** @type {import('next').NextConfig} */
const nextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: '/vnrvjietexams/:path*',
  //       destination: 'http://vnrvjietexams.net/:path*',
  //     },
  //   ]
  // },

  typescript: {
    ignoreBuildErrors: true,
  },

};

export default nextConfig;
