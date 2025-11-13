module.exports = {
  apps: [{
    name: 'ocgn-ordenes',
    script: 'C:\\Users\\CyT3\\Documents\\Deploy\\ocgn_ordenes\\.venv\\Scripts\\python.exe',
    args: '-m uvicorn main:app --host 0.0.0.0 --port 8008',
    cwd: 'C:\\Users\\CyT3\\Documents\\Deploy\\ocgn_ordenes',
    interpreter: 'none',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true
  }]
}
