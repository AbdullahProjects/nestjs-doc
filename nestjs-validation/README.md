# NestJS Validation Notes

Easy and beginner-friendly notes for NestJS Validation.

Official Documentation: https://docs.nestjs.com/techniques/validation

---

# Install Required Packages

```bash
npm install class-validator class-transformer
```

These packages are required for validation in NestJS.

| Package | Purpose |
|---|---|
| class-validator | Validation decorators |
| class-transformer | Transform plain objects into DTO classes |

---

# What is Validation?

Validation checks incoming request data before processing it.

Example:

```json
{
  "email": "wrong-email",
  "password": ""
}
```

NestJS can automatically reject invalid requests.

---

# What is DTO?

DTO = Data Transfer Object

A DTO defines:

- expected request structure
- validation rules

Example:

```ts
export class CreateUserDto {
  email: string;
  password: string;
}
```

---

# Basic Validation Example

## Create DTO

```ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
```

---

## Use DTO in Controller

```ts
@Post()
create(@Body() dto: CreateUserDto) {
  return 'User created';
}
```

---

# Enable ValidationPipe

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

---

# Validation Error Example

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

---

# Validation Types Summary

NestJS validation mainly uses:

- Validation decorators
- ValidationPipe
- Parse Pipes
- DTO validation

---

# 1. String Validation

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

---

# 2. Email Validation

```ts
@IsEmail()
email: string;
```

Checks valid email format.

---

# 3. Number Validation

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

---

# 4. Boolean Validation

```ts
@IsBoolean()
isAdmin: boolean;
```

---

# 5. Date Validation

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

---

# 6. Array Validation

```ts
@IsArray()
tags: string[];
```

```ts
@ArrayMinSize(1)
@ArrayMaxSize(5)
tags: string[];
```

---

# 7. Enum Validation

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

---

# 8. Optional Fields

```ts
@IsOptional()
bio?: string;
```

---

# 9. URL Validation

```ts
@IsUrl()
website: string;
```

---

# 10. UUID Validation

```ts
@IsUUID()
id: string;
```

---

# 11. Phone Number Validation

```ts
@IsPhoneNumber()
phone: string;
```

---

# 12. Nested Object Validation

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

---

# 13. Custom Validation

```ts
@IsStrongPassword()
password: string;
```

You can also create your own custom validators.

---

# 14. Route Param Validation

```ts
@IsNumberString()
id: string;
```

---

# 15. Parse Pipes Validation

## ParseIntPipe

```ts
@Param('id', ParseIntPipe) id: number
```

---

## ParseBoolPipe

```ts
@Query('active', ParseBoolPipe) active: boolean
```

---

## ParseArrayPipe

```ts
@Query(
  'ids',
  new ParseArrayPipe({
    items: Number,
    separator: ',',
  }),
)
ids: number[]
```

---

# Most Common Validation Decorators

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

---

# Recommended ValidationPipe Setup

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

# whitelist

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

---

# forbidNonWhitelisted

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

---

# transform

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

---

# Validate Route Parameters

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

# ParseIntPipe

```ts
@Get(':id')
findOne(
  @Param('id', ParseIntPipe) id: number,
) {
  return id;
}
```

Ensures `id` is a valid number.

---

# ParseBoolPipe

```ts
@Get()
findAll(
  @Query('active', ParseBoolPipe) active: boolean,
) {
  return active;
}
```

Request:

```bash
/users?active=true
```

Result:

```ts
true
```

---

# ParseArrayPipe

```ts
@Get()
findByIds(
  @Query(
    'ids',
    new ParseArrayPipe({
      items: Number,
      separator: ',',
    }),
  )
  ids: number[],
) {
  return ids;
}
```

Request:

```bash
/users?ids=1,2,3
```

Result:

```ts
[1, 2, 3]
```

---

# ValidationPipe Options

## disableErrorMessages

```ts
new ValidationPipe({
  disableErrorMessages: true,
})
```

Hides detailed errors.

Useful in production.

---

## stopAtFirstError

```ts
new ValidationPipe({
  stopAtFirstError: true,
})
```

Stops validation after first error.

---

## skipMissingProperties

```ts
new ValidationPipe({
  skipMissingProperties: true,
})
```

Useful for PATCH requests.

---

# Mapped Types

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