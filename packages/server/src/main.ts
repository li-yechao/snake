import { NestFactory } from '@nestjs/core'
import { program } from 'commander'
import { AppModule } from './app.module'
import { Config } from './config'

program
  .command('serve')
  .description('Start server')
  .option('--cors', 'Enable cors', false)
  .requiredOption('-p, --port <port>', 'Listening port', '8080')
  .option('--proxy <proxy>', 'Proxy url used by binance api')
  .action(async ({ cors, port, proxy }: { cors: boolean; port: string; proxy: string }) => {
    Config.init({
      port,
      proxy,
    })

    const app = await NestFactory.create(AppModule)

    if (cors) {
      app.enableCors()
    }

    await app.listen(port)
  })

program.parse(process.argv)
