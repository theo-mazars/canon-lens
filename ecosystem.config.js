module.exports = {
  apps: [
    {
      name: "canon-lens",
      cwd: "/home/production/canon-lens/current",
      script: "yarn start -p 7020",
      env: {
        NODE_ENV: "production",
      },
    },
  ],

  deploy: {
    production: {
      user: "production",
      host: "server1.theomazars.com",
      ref: "origin/main",
      repo: "git@github.com:theo-mazars/canon-lens",
      path: "/home/production/canon-lens",
      "pre-deploy-local": "",
      "post-deploy": "yarn && yarn build && pm2 reload all --update-env",
      "pre-setup": "",
    },
  },
};
