import {Controller, Get, HttpStatus, Post, Req, Res} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import {Response} from 'express';
import {AppService} from './app.service';
import {CartItemService} from "./services/cartItemService";
import {CartService} from "./services/cartService";
import {NewsService} from "./services/newsService";
import {ProductService} from "./services/productService";
import {ReviewService} from "./services/reviewService";
import {UserService} from "./services/userService";
import {SubscribeService} from "./services/subscribeService";

@Controller()
export class AppController {
    constructor(private appService: AppService,
                private cartItemService: CartItemService,
                private cartService: CartService,
                private newsService: NewsService,
                private productService: ProductService,
                private reviewService: ReviewService,
                private userService: UserService,
                private subscribeService: SubscribeService) {
    }

    @Get('/loadingTime')
    getLoadingTime() {
        return this.appService.getTotalRequestTime();
    }

    @Get()
    root(@Res() res: Response) {
        return res.redirect("index");
    }

    @Get('/images/*')
    async serveImages(@Res() res): Promise<any> {
        const url = res.req.url;
        const filePath = path.join(__dirname, '..', 'public', url);

        try {
            const fileStream = fs.createReadStream(filePath);
            res.writeHead(200, {'Content-Type': 'application/octet-stream'});
            fileStream.pipe(res);
        } catch (error) {
            res.status(HttpStatus.NOT_FOUND).send('File not found');
        }
    }

    @Get('/scripts/*')
    async serveScripts(@Res() res: Response): Promise<any> {
        const url = res.req.url;
        const filePath = path.join(__dirname, '..', 'public', url);

        try {
            const fileContent = await fs.promises.readFile(filePath, 'utf8');
            res.setHeader('Content-Type', 'text/javascript');
            res.status(HttpStatus.OK).send(fileContent);
        } catch (error) {
            res.status(HttpStatus.NOT_FOUND).send('File not found');
        }
    }

    @Post('/login')
    async login(@Req() req: Request, @Res() res: Response): Promise<any> {
        const data = req.body;
        var result = await this.userService.login(data);
        res.json(result);
        return;
    }

    @Get("/products")
    async getManageProducts(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.productService.getManageProducts();
        res.json(result);
        return;
    }

    @Post("/products")
    async postManageProducts(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.productService.postManageProducts(req);
        res.json(result);
        return;
    }

    @Get('/product/:productId')
    async getProduct(@Res() res: Response): Promise<any> {
        const productId = parseInt(res.req.params.productId);
        var result = await this.productService.getProduct(productId);
        res.json(result);
        return;
    }

    @Post("/checkRoleIsBanned")
    async checkRole(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.userService.checkRole(req);
        res.json(result);
        return;
    }

    @Post("/addRate")
    async addRate(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.productService.addRate(req);
        res.json(result);
        return;
    }

    @Post("/send_code")
    async send_code(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.appService.sendCode(req);
        res.json(result);
        return;
    }

    @Post("/send_recover_code")
    async send_recover_code(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.appService.sendRecoverCode(req);
        res.json(result);
        return;
    }

    @Post("/check_recover_code")
    async check_recover_code(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.appService.checkRecoverCode(req);
        res.json(result);
        return;
    }

    @Post("/change_password")
    async change_password(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.userService.changePassword(req);
        res.json(result);
        return;
    }

    @Post("/registration")
    async register(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.userService.register(req);
        res.json(result);
        return;
    }

    @Post("/addUser")
    async addUser(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.userService.addUser(req);
        res.json(result);
        return;
    }

    @Get("/users")
    async getManageUsers(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.userService.getManageUsers();
        res.json(result);
        return;
    }

    @Post("/users")
    async postManageUsers(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.userService.postManageUsers(req);
        res.json(result);
        return;
    }

    @Get("/getReviews")
    async getManageReviews(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.reviewService.getManageReviews();
        res.json(result);
        return;
    }

    @Post("/postReviews")
    async postManageReviews(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.reviewService.postManageReviews(req);
        res.json(result);
        return;
    }

    @Get("/getNews")
    async getManageNews(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.newsService.getManageNews();
        res.json(result);
        return;
    }

    @Post("/postNews")
    async postManageNews(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.newsService.postManageNews(req);
        res.json(result);
        return;
    }

    @Post("/subscript")
    async subscript(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.subscribeService.subscript(req);
        res.json(result);
        return;
    }

    @Post("/unsubscript")
    async unsubscript(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.subscribeService.unsubscript(req);
        res.json(result);
        return;
    }

    @Get('/search/:search_term')
    async search(@Res() res: Response): Promise<any> {
        const search_term = res.req.params.search_term;
        var result = await this.productService.search(search_term);
        res.json(result);
        return;
    }

    @Post("/confirmEmail")
    async confirmEmail(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.userService.confirmEmail(req);
        res.json(result);
        return;
    }

    @Post("/cart")
    async cart(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.cartItemService.cart(req);
        res.json(result);
        return;
    }

    @Post("/changeQuantity")
    async changeQuantity(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.cartItemService.changeQuantity(req);
        res.json(result);
        return;
    }

    @Post("/deleteCartProduct")
    async deleteCartProduct(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.cartItemService.deleteCartProduct(req);
        res.json(result);
        return;
    }

    @Post("/addProductToCart")
    async addProductToCart(@Req() req: Request, @Res() res: Response): Promise<any> {
        var result = await this.cartItemService.addProductToCart(req);
        res.json(result);
        return;
    }

    @Get(':pageName')
    dynamicPage(@Res() res: Response) {
        const pageName = res.req.params.pageName;
        return res.render(pageName);
    }
}
