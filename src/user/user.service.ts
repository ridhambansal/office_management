import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>) { }

  async create(createUserDto: CreateUserDto) {
    let user = await this.repo.findOne({ where: { email: createUserDto.email } })
    if (user)
      throw new HttpException("Email already exists", HttpStatus.BAD_REQUEST)
    if (createUserDto.password.length < 8)
      throw new HttpException('Password length should be greater than 8', HttpStatus.BAD_REQUEST)
    const saltOrRounds = 10
    const pass = createUserDto.password
    const hash = await bcrypt.hash(pass, saltOrRounds)
    createUserDto.password = hash
    const newUser = this.repo.create(createUserDto)
    // input={first_name: createUserDto.first_name, last_name: createUserDto.last_name, email: createUserDto.email, password: createUserDto.password, role: createUserDto.role}
    return this.repo.save(newUser)
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(token: string) {
    let user = await this.repo.find({ where: { email: token } });
    console.log('found user :: ', user)
    return user
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    let user = await this.repo.find({ where: { email: email } })
    if (updateUserDto.first_name)
      user[0].first_name = updateUserDto.first_name
    if (updateUserDto.last_name)
      user[0].last_name = updateUserDto.last_name
    // if(updateUserDto.role)
    //   user[0].role=updateUserDto.role
    if (updateUserDto.password) {
      if (updateUserDto.password.length < 8)
        throw new HttpException("Password length should be more than 8", HttpStatus.BAD_REQUEST)
      const newPass = await bcrypt.hash(updateUserDto.password, 10)
      user[0].password = newPass
    }
    const updateUser = await this.repo.save(user)
    return updateUser
  }

  async remove(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.repo.remove(user);
  }

  async login(loginUserDTO: LoginUserDTO) {
    let user = await this.repo.findOne({ where: { email: loginUserDTO.email } })
    let pass
    if (user)
      pass = await bcrypt.compare(loginUserDTO.password, user.password);
    if (!pass || !user)
      throw new HttpException("Incorrect email/password", HttpStatus.BAD_REQUEST)

    return user
  }

  async addToken(email: string, token: string, firebaseToken: string) {
    const user = await this.repo.findOne({ where: { email: email } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    // Use a consistent Firebase token for all users since Firebase is not configured
    const consistentFirebaseToken = 'default-firebase-token';
    
    user.token = token;
    user.firebaseToken = consistentFirebaseToken;
    return this.repo.save(user);
  }

  async checkTokenExpiry() {
    return await "USER"
  }

  async getUserToken(email: string) {
    const user = await this.repo.findOne({ where: { email: email } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {
      token: user.token,
      firebaseToken: user.firebaseToken
    };
  }

  // async authorizeUser(token: string){
  //   const user=await this.repo.find({where: {token: token}})
  //   const role=user[0].role
  //   const role_name=await this.role_repo.find({where: {role_id: role.role_id}})
  //   if(role_name[0].role_name=="admin")
  //     throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
  // }
}
