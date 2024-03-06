import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Post, Req, Res} from "@nestjs/common";
import {Response} from "express";
import {UserService} from "../services/userService";

@ApiTags('user')
@Controller("/user")
export class UserController {
    constructor(private userService: UserService){};

    @Post('/login')
    @ApiOperation({summary: 'Login user'})
    @ApiBody({
        schema: {
            properties: {
                email: {type: 'string'},
                password: {type: 'string', format: 'password'}
            }
        }
    })
    @ApiResponse({status: 200, description: 'User logged in successfully'})
    @ApiResponse({status: 400, description: 'Invalid credentials'})
    async login(@Req() req: Request, @Res() res: Response): Promise<any> {
        const data = req.body;
        var result = await this.userService.login(data);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Post("/checkRoleIsBanned")
    @ApiOperation({summary: 'Check role and user is banned'})
    @ApiBody({
            schema: {
                properties: {
                    token: {type: 'string'}
                }
            }
        }
    )
    @ApiResponse({status: 200, description: 'Role and user is banned check result'})
    @ApiResponse({status: 400, description: 'Invalid token'})
    async checkRole(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.userService.checkRole(req);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Post("/change_password")
    @ApiOperation({ summary: 'Change user password' })
    @ApiBody({
        schema: {
            properties: {
                email: { type: 'string' },
                password: { type: 'string', format: 'password' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    @ApiResponse({ status: 400, description: 'Invalid email, password or other error' })
    async change_password(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.userService.changePassword(req);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Post("/registration")
    @ApiOperation({ summary: 'User registration' })
    @ApiBody({
        schema: {
            properties: {
                email: { type: 'string' },
                password: { type: 'string', format: 'password' },
                code: { type: 'string' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Invalid email, password, code or other error' })
    async register(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.userService.register(req);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Post("/addUser")
    @ApiOperation({ summary: 'User addition' })
    @ApiBody({
        schema: {
            properties: {
                email: { type: 'string' },
                password: { type: 'string', format: 'password' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'User added successfully' })
    @ApiResponse({ status: 400, description: 'Invalid email, password or other error' })
    async addUser(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.userService.addUser(req);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Get("/users")
    @ApiOperation({summary: 'Get all users'})
    @ApiResponse({status: 200, description: 'Returns all users'})
    async getManageUsers(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.userService.getManageUsers();
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Post("/users")
    @ApiOperation({summary: 'Manage users'})
    @ApiBody({
        schema: {
            properties: {
                userId: {type: 'string'},
                action: {type: 'string'}
            }
        }
    })
    @ApiResponse({status: 200, description: 'Operation done successfully'})
    @ApiResponse({status: 400, description: 'Error during operation'})
    async postManageUsers(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.userService.postManageUsers(req);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }

    @Post("/confirmEmail")
    @ApiOperation({ summary: 'Confirm email' })
    @ApiBody({
        schema: {
            properties: {
                email: { type: 'string' },
                code: { type: 'string' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Email confirmed successfully' })
    @ApiResponse({ status: 400, description: 'Invalid email, code or other error' })
    async confirmEmail(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.userService.confirmEmail(req);
        res.status(result.success ? 200 : 400).json(result);
        return;
    }
}