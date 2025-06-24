import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';

@Public()
@Controller('')
export class AppController {
    @Get('')
    async healthCheck() {
        return 'OK'
    }
    @Get('/healthy')
    async healthCheckHealthyPath() {
        return 'OK'
    }

}