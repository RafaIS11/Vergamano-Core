module.exports = {
  apps: [{
    name: "vergamano-bridge",
    script: "./telegram_bridge.js",
    watch: false,
    max_memory_restart: '250M',
    exp_backoff_restart_delay: 100,
    env: {
      NODE_ENV: "production",
    }
  }]
}
