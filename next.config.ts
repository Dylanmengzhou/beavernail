import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "telegraph-image-czf.pages.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // 🔥 关键配置：处理WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // 处理tesseract.js的依赖
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    } else {
      // 服务器端配置
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        encoding: false,
      };

      // 🔥 确保WebAssembly文件被正确处理
      config.module.rules.push({
        test: /\.wasm$/,
        type: "webassembly/async",
      });
    }

    return config;
  },
  // 🔥 实验性功能
  experimental: {
    serverComponentsExternalPackages: ["tesseract.js"],
  },
};

export default nextConfig;
