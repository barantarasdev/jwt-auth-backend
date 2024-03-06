import { Length, Matches } from 'class-validator';

const { PASSWORD, EMAIL } = {
  EMAIL:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/,
};

export class RegisterDTO {
  @Length(2, 30, { message: 'Minimum 2 symbols' })
  name: string;

  @Matches(EMAIL, { message: 'Email is not valid' })
  email: string;

  @Matches(PASSWORD, { message: 'Password is not valid (A, a, 1, /)' })
  password: string;
}
