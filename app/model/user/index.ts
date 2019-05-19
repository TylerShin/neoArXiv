import uuid from 'uuid/v1';
import jwt from 'jsonwebtoken';
import { Decorator, Query, Table } from 'dynamo-types';
import { ITokenPayload } from './types';

@Decorator.Table({ name: `neoarxiv-user` })
export class User extends Table {
  @Decorator.HashPrimaryKey('id')
  public static readonly primaryKey: Query.HashPrimaryKey<User, string>;

  @Decorator.HashGlobalSecondaryIndex('username', { name: 'username-index' })
  public static readonly usernameSecondaryIndex: Query.HashGlobalSecondaryIndex<
    User,
    string
  >;

  @Decorator.Writer()
  public static readonly writer: Query.Writer<User>;

  @Decorator.Attribute({ name: 'id' })
  public id: string = uuid();

  @Decorator.Attribute({ name: 'email' })
  public email: string[] = [];

  @Decorator.Attribute({ name: 'username' })
  public username: string;

  @Decorator.Attribute({ name: 'password' })
  public password: string;

  public generateToken(payload: ITokenPayload) {
    if (!process.env["AUTH_SECRET"]) {
      throw new Error("secret key for JWT is missing"); 
    }
    const token = jwt.sign(payload, process.env["AUTH_SECRET"]!, { expiresIn: '30 days' });
    return token;
  }

  public static checkToken(token: string) {
    if (!process.env["AUTH_SECRET"]) {
      throw new Error("secret key for JWT is missing"); 
    }
    const check = jwt.verify(token, process.env["AUTH_SECRET"]!);
    return check;
  }
}

export default User;
