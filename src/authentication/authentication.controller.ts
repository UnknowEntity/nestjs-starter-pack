import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import JwtRefreshGuard from './jwt-refresh.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const user = request.user;
    const [accessTokenName, accessTokenValue, accessTokenCookieOptions] =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);

    const [refreshTokenName, refreshTokenValue, refreshTokenCookieOptions] =
      await this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    request.res.cookie(
      accessTokenName,
      accessTokenValue,
      accessTokenCookieOptions,
    );

    request.res.cookie(
      refreshTokenName,
      refreshTokenValue,
      refreshTokenCookieOptions,
    );

    return user;
  }

  @HttpCode(204)
  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser) {
    const cookies = this.authenticationService.getCookieForLogOut();

    const [accessTokenName, accessTokenValue, accessTokenCookieOptions] =
      cookies[0];

    const [refreshTokenName, refreshTokenValue, refreshTokenCookieOptions] =
      cookies[1];

    request.res.cookie(
      accessTokenName,
      accessTokenValue,
      accessTokenCookieOptions,
    );

    request.res.cookie(
      refreshTokenName,
      refreshTokenValue,
      refreshTokenCookieOptions,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const [accessTokenName, accessTokenValue, accessTokenCookieOptions] =
      this.authenticationService.getCookieWithJwtAccessToken(request.user.id);

    request.res.cookie(
      accessTokenName,
      accessTokenValue,
      accessTokenCookieOptions,
    );
    return request.user;
  }
}
