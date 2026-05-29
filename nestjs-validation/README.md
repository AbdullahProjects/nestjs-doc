# NestJS Pipes & Validation Notes

Easy and beginner-friendly notes for NestJS Validation. If you want to check official documentation, visit the following pages below:

Official Documentation for Pipes: https://docs.nestjs.com/pipes

Official Documentation for Validation: https://docs.nestjs.com/techniques/validation

---

# 1. What are Pipes?

In NestJS, a Pipe is a feature used to validate and transform incoming request data (client data) before it reaches the controller method.

### Main Purpose of Pipes:

- **Transformation**: Transform input data to the desired form (e.g., from string to integer)
- **Validation**: Check if incoming data is correct (e.g., ensure email is valid, ensure age is valid)

### Why Pipes are Important:

Without pipes, we need to manually convert incoming request data into the required type inside the controller method. For example, route parameters are received as strings, so we use functions like Number(id) to convert them into numbers before passing them to the service.

```ts
@Get(':id')
findOne(@Param('id') id: string) {
  return this.userService.findOne(Number(id));
}
```

With pipes, NestJS automatically validates and transforms incoming request data before it reaches the controller method. In the example above, ParseIntPipe automatically converts the id from a string into a number and also throws an error if the value is invalid. This makes the code cleaner, safer, and easier to maintain.

```ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.userService.findOne(id);
}
```

### Request Lifecycle Position:

NestJS executes pipes before the controller method runs. If pipe validation fails, controller never executes. Nest automatically throws exceptions.

```bash
REQUEST -> MIDDLEWARE -> GUARDS -> INTERCEPTORS -> PIPES -> CONTROLLER -> SERVICE
```

# 2. Built-in Pipes

Nest comes with several pipes available out-of-the-box. They're exported from the `@nestjs/common` package:

- i. ParseIntPipe
- ii. ParseFloatPipe
- iii. ParseBoolPipe
- iv. ParseUUIDPipe
- v. ParseArrayPipe
- vi. ParseEnumPipe
- vii. DefaultValuePipe
- viii. ParseFilePipe
- ix. ParseDatePipe
- x. ValidationPipe

--- 

### i. ParseIntPipe

ParseIntPipe is a built-in pipe that converts a string into an integer and also validates it.

Example:

```ts
@Get('users/:id')
findOne(
  @Param('id', ParseIntPipe) id: number
) {
  console.log(typeof id); // number
}
```

Request:

```bash
GET /users/5
```

**Result**: id will transform into 5 integer data type from '5' string type.

Invalid Request:

```bash
GET /users/abc
```

Nest returns:

```bash
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)"
}
```


---

### ii. ParseBoolPipe

In NestJS, ParseBoolPipe is a built-in pipe that converts string values into boolean (true or false) and validates them.

Example:

```ts
@Get('users')
find(@Query('active', ParseBoolPipe) active: boolean) {
  return active;
}
```

Request:

```bash
GET /users?active=true
```

**Result**: active query parameter transfrom into true boolean data type from 'true' string.

Invalid Request:

```bash
GET /users?active=hello
```

Nest returns:

```bash
{
  "statusCode": 400,
  "message": "Validation failed (boolean string is expected)"
}
```

---

### iii. ParseFloatPipe

In NestJS, ParseBoolPipe is a built-in pipe that converts string values into float number and validates them.

Example:

```ts
@Get('users')
find(@Query('price', ParseFloatPipe) price: number) {
  return price;
}
```

Request:

```bash
GET /users?price=5.5
```

**Result**: `price` will transform into 5.5 float data type from '5.5' string type.

Invalid Request:

```bash
GET /users?price=abc
```

Nest returns:

```bash
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)"
}
```

--- 

### iv. ParseUUIDPipe

ParseUUIDPipe validates whether the value is a valid UUID.

Example:

```ts
@Get('users/:id')
findOne(
  @Param('id', ParseUUIDPipe) id: string
) {
  return id;
}
```

Valid UUID: 550e8400-e29b-41d4-a716-446655440000  

Request:

```bash
GET /users/550e8400-e29b-41d4-a716-446655440000
```

**Result**: Valid UUID is returned as it is.

Invalid Request:

```bash
GET /users/12345
```

Nest returns:

```bash
{
  "statusCode": 400,
  "message": "Validation failed (uuid is expected)"
}
```

---

### v. ParseArrayPipe

ParseArrayPipe validates and transforms comma-separated values into arrays.

Example:

```ts
@Get('users')
find(
  @Query('ids', new ParseArrayPipe({ items: Number }))
  ids: number[],
) {
  return ids;
}
```

Request:

```bash
GET /users?ids=1,2,3
```

**Result**: "1,2,3" (string) → [1, 2, 3] (array)

Invalid Request:

```bash
GET /users?ids=a,b,c
```

Nest returns:

```bash
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)"
}
```

--- 

### vi. ParseEnumPipe

ParseEnumPipe validates whether a value exists in a user defined enum.

Example:

```ts
enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Get('users')
find(
  @Query('role', new ParseEnumPipe(Role))
  role: Role,
) {
  return role;
}
```

Request:

```bash
GET /users?role=admin
```

**Result**: "admin" is accepted

Invalid Request:

```bash
GET /users?role=manager
```

Nest returns:

```bash
{
  "statusCode": 400,
  "message": "Validation failed (enum string is expected)"
}
```

---

### DefaultValuePipe

DefaultValuePipe provides a default value when no value is provided.

Example:

```ts
@Get('users')
find(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe)
  page: number,
) {
  return page;
}
```

Request:

```bash
GET /users
```

**Result**: No value provided → page = 1

Request with value:

```bash
GET /users?page=5
```

**Result**: "5" (string) → 5 (number)

---

# 3. ValidationPipe

This is the MOST IMPORTANT built-in pipe in NestJS. Used with DTOs and class-validator package.


### Install Required Packages

```bash
npm install class-validator class-transformer
```

These packages are required for validation in NestJS.

| Package | Purpose |
|---|---|
| class-validator | Validation decorators |
| class-transformer | Transform plain objects into DTO classes |


## What is DTO?

DTO = Data Transfer Object

A DTO defines:

- expected request structure
- validation rules

Example:

```ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
```


## Use DTO in Controller

```ts
@Post()
create(@Body() dto: CreateUserDto) {
  return 'User created';
}
```


## Enable ValidationPipe

Inside `main.ts`

```ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
```

This enables validation globally.


## Validation Error Example

Request:

```json
{
  "email": "abc",
  "password": ""
}
```

Response:

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password should not be empty"
  ],
  "error": "Bad Request"
}
```

## DTO Validation 

### 1. String Validation

Used for text fields.

```ts
@IsString()
name: string;
```

```ts
@IsNotEmpty()
name: string;
```

```ts
@MinLength(6)
password: string;
```

```ts
@MaxLength(20)
username: string;
```

```ts
@Matches(/regex/)
phone: string;
```


### 2. Email Validation

```ts
@IsEmail()
email: string;
```

Checks valid email format.


### 3. Number Validation

```ts
@IsNumber()
price: number;
```

```ts
@IsInt()
age: number;
```

```ts
@Min(1)
quantity: number;
```

```ts
@Max(100)
score: number;
```


### 4. Boolean Validation

```ts
@IsBoolean()
isAdmin: boolean;
```


### 5. Date Validation

```ts
@IsDate()
createdAt: Date;
```

```ts
@IsDateString()
dob: string;
```

Example:

```json
{
  "dob": "2026-05-21"
}
```


### 6. Array Validation

```ts
@IsArray()
tags: string[];
```

```ts
@ArrayMinSize(1)
@ArrayMaxSize(5)
tags: string[];
```


### 7. Enum Validation

```ts
enum Role {
  ADMIN = 'admin',
  USER = 'user',
}
```

```ts
@IsEnum(Role)
role: Role;
```


### 8. Optional Fields

```ts
@IsOptional()
bio?: string;
```


### 9. URL Validation

```ts
@IsUrl()
website: string;
```


### 10. UUID Validation

```ts
@IsUUID()
id: string;
```


### 11. Phone Number Validation

```ts
@IsPhoneNumber()
phone: string;
```


### 12. Nested Object Validation

```ts
export class AddressDto {
  @IsString()
  city: string;
}
```

```ts
export class UserDto {
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
```


### 13. Custom Validation

```ts
@IsStrongPassword()
password: string;
```

You can also create your own custom validators.


### 14. Route Param Validation

```ts
@IsNumberString()
id: string;
```

### Most Common Validation Decorators

| Decorator | Purpose |
|---|---|
| @IsString() | Validate string |
| @IsNotEmpty() | Required field |
| @IsEmail() | Email validation |
| @MinLength() | Minimum length |
| @MaxLength() | Maximum length |
| @IsNumber() | Number validation |
| @IsBoolean() | Boolean validation |
| @IsArray() | Array validation |
| @IsOptional() | Optional field |
| @IsEnum() | Enum validation |
| @IsUUID() | UUID validation |
| @IsUrl() | URL validation |


## Recommended ValidationPipe Setup

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    stopAtFirstError: true,
  }),
);
```

---

### whitelist

```ts
whitelist: true
```

Removes fields not defined in DTO.

Request:

```json
{
  "email": "test@gmail.com",
  "password": "123456",
  "role": "admin"
}
```

If `role` is not inside DTO, it gets removed.


### forbidNonWhitelisted

```ts
forbidNonWhitelisted: true
```

Throws error when extra fields exist.

Error:

```json
{
  "message": [
    "property role should not exist"
  ]
}
```


### transform

```ts
transform: true
```

Automatically converts data types.

Example:

```ts
@Get(':id')
findOne(@Param('id') id: number) {
  console.log(typeof id);
}
```

Without transform:

```ts
string
```

With transform:

```ts
number
```


### disableErrorMessages

```ts
new ValidationPipe({
  disableErrorMessages: true,
})
```

Hides detailed errors.

Useful in production.


### stopAtFirstError

```ts
new ValidationPipe({
  stopAtFirstError: true,
})
```

Stops validation after first error.


### skipMissingProperties

```ts
new ValidationPipe({
  skipMissingProperties: true,
})
```

Useful for PATCH requests.


## Validate Route Parameters

DTO:

```ts
import { IsNumberString } from 'class-validator';

export class FindOneParams {
  @IsNumberString()
  id: string;
}
```

Controller:

```ts
@Get(':id')
findOne(@Param() params: FindOneParams) {
  return params.id;
}
```

---

# 4. Pip Binding Levels

Pipes can be used in multiple places. At parameter level, controller level and method level.

### i. Parameter Level

```ts
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

Only affects one parameter.

### ii. Method Level

```ts
@UsePipes(ValidationPipe)
@Post()
create()
```

Affects entire method.

### iii. Controller Level

```ts
@UsePipes(ValidationPipe)
@Controller('users')
```

Affects all routes in controller.

Global Level

```ts
app.useGlobalPipes(new ValidationPipe())
```

Affects entire application.

---

# 5. Custom Pipes

You can create your own pipe.

```ts
import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class UppercasePipe
  implements PipeTransform {

  transform(value: any) {

    if (!value) {
      throw new BadRequestException(
        'Value is required',
      );
    }

    return value.toUpperCase();
  }
}
```

Input

```bash
Ali
```

Output

```bash
ALI
```

---

# 6. Mapped Types

Install:

```bash
npm install @nestjs/mapped-types
```

---

# PartialType

Makes all fields optional.

Base DTO:

```ts
export class CreateUserDto {
  name: string;
  email: string;
}
```

Update DTO:

```ts
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

Equivalent to:

```ts
export class UpdateUserDto {
  name?: string;
  email?: string;
}
```

---

# PickType

Select specific fields.

```ts
export class UserEmailDto extends PickType(
  CreateUserDto,
  ['email'] as const,
) {}
```

---

# OmitType

Remove specific fields.

```ts
export class UserWithoutPasswordDto extends OmitType(
  CreateUserDto,
  ['password'] as const,
) {}
```

---

# IntersectionType

Merge multiple DTOs.

```ts
export class AddressDto {
  city: string;
}

export class UserDto {
  name: string;
}

export class CompleteDto extends IntersectionType(
  UserDto,
  AddressDto,
) {}
```

---

# Array Validation

Wrong:

```ts
create(@Body() users: CreateUserDto[]) {}
```

Correct:

```ts
@Post()
createBulk(
  @Body(new ParseArrayPipe({ items: CreateUserDto }))
  users: CreateUserDto[],
) {
  return users;
}
```

---

# Important Notes

## Use Classes, Not Interfaces

Wrong:

```ts
interface CreateUserDto {}
```

Correct:

```ts
class CreateUserDto {}
```

Interfaces disappear at runtime.

---

# Do NOT Use Type-Only Imports

Wrong:

```ts
import type { CreateUserDto } from './dto';
```

Correct:

```ts
import { CreateUserDto } from './dto';
```

---

# Real World DTO Example

```ts
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  bio?: string;
}
```

---

# Recommended Production Setup

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    stopAtFirstError: true,
  }),
);
```

---

# Common Beginner Mistakes

- Forgot to enable ValidationPipe
- Forgot to install class-transformer
- Used interface instead of class
- Used type-only imports
- Forgot validation decorators

---

# Helpful Links

- NestJS Validation Docs:
  https://docs.nestjs.com/techniques/validation

- class-validator:
  https://github.com/typestack/class-validator

- class-transformer:
  https://github.com/typestack/class-transformer