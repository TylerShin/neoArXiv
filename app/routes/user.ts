import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { Route, Namespace, ParameterDefinitionMap } from 'vingle-corgi';
import User from '../model/user';
import { IUser } from '../model/user/types';

const authBody: ParameterDefinitionMap = {
  email: {
    in: 'body',
    def: Joi.string()
      .email()
      .optional(),
  },
  username: {
    in: 'body',
    def: Joi.string().optional(),
  },
  password: {
    in: 'body',
    def: Joi.string(),
  },
};

const userRoutes = new Namespace('/users', {
  children: [
    Route.GET(
      '/check',
      { operationId: 'checkAuth', desc: 'check user token to sign in' },
      {
        'x-neoarxiv-token': {
          in: 'header',
          def: Joi.string(),
        },
      },
      async function() {
        const token = this.headers['x-neoarxiv-token'];
        const check = User.checkToken(token);
        return this.json({ data: check });
      }
    ),
    Route.POST(
      '/new',
      {
        operationId: 'newUser',
      },
      authBody,
      async function() {
        const user = new User();
        if (!this.params.email && !this.params.username) {
          throw new Error('missing both username and email');
        }

        await checkUsernameDuplicated(this.params.username);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.params.password, salt);

        const token = user.generateToken({
          id: user.id,
          username: this.params.username,
          password: this.params.password,
        });

        user.email = [this.params.email];
        user.username = this.params.username;
        user.password = hashedPassword;
        await user.save();
        return this.json(
          {
            data: user,
          },
          200,
          {
            'x-neoarxiv-token': token,
          }
        );
      }
    ),
    Route.POST(
      '/sign_in',
      {
        operationId: 'sign in',
        desc: 'try to sign in',
      },
      authBody,
      async function() {
        // const email = this.params.email;
        const password = this.params.password;
        const username = this.params.username;

        const res = await User.usernameSecondaryIndex.query(username);
        if (!res.records || res.records.length === 0) {
          throw new Error('no mathcing user exists!');
        }

        const userRecord = res.records[0] as User;
        const user = userRecord.serialize() as IUser;
        const rightPassword = await bcrypt.compare(password, user.password);
        if (!rightPassword) {
          throw new Error('username or password is invalid');
        }

        const token = userRecord.generateToken({
          id: user.id,
          username: user.username,
          password: this.params.password,
        });

        return this.json(user, 200, {
          'x-neoarxiv-token': token,
        });
      }
    ),
    Route.GET(
      '/duplicate',
      {
        operationId: 'auth duplicate',
        desc: 'check username is duplicated or not',
      },
      {
        username: {
          in: 'query',
          def: Joi.string().optional(),
        },
      },
      async function() {
        const username = this.params.username;
        await checkUsernameDuplicated(username)
        return this.json({ success: true });
      }
    ),
  ],
});

async function checkUsernameDuplicated(username: string) {
  const userRecord = await User.usernameSecondaryIndex.query(username);
  if (userRecord.count && userRecord.count > 0) {
    throw new Error('already existing username');
  }
  return true;
}

export default userRoutes;
