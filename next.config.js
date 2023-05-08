/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.(wav)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '/_next',
              outputPath: 'static/images',
              name: '[name].[ext]',
            },
          },
        ],
      });
  
      return config;
    },
  };
  
