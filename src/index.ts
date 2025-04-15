import app from './app'
import ENV from './configs/env'

app.listen(8888, () => {
  console.log('Server is running at http://localhost:3000')
  console.log('Press Ctrl+C to quit.')
  console.log('NODE_ENV:', ENV)
})
