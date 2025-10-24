# Add environment variables to Vercel
Write-Host "Adding MONGODB_URI to production..." -ForegroundColor Yellow
"mongodb+srv://Adithya:adi01@cluster0.w8drv7e.mongodb.net/aayush?retryWrites=true&w=majority&appName=Cluster0" | vercel env add MONGODB_URI production

Write-Host "Adding JWT_SECRET to production..." -ForegroundColor Yellow
"a8f5f167f44f4964e6c998dee827110c6b054764316a487364e1b776c845b8f9" | vercel env add JWT_SECRET production

Write-Host "Adding NEXT_PUBLIC_APP_URL to production..." -ForegroundColor Yellow
"https://aa-881gkzkzn-adis-projects-d4608d41.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production

Write-Host "Environment variables added successfully!" -ForegroundColor Green
