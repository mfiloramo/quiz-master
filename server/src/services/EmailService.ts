import { CourierClient } from "@trycourier/courier";
import jwt from "jsonwebtoken";

export class EmailService {
  static async sendConfirmationEmail({ userId, userName, userEmail }: {
    userId: string,
    userName: string,
    userEmail: string
  }) {

    if (!process.env.SECRET_REGISTRATION_KEY) {
      throw new Error("SECRET_REGISTRATION_KEY is not set");
    }

    if (!process.env.COURIER_AUTH_TOKEN) {
      throw new Error("COURIER_AUTH_TOKEN is not set");
    }

    const token = jwt.sign({ userId }, process.env.SECRET_REGISTRATION_KEY, { expiresIn: "1d" });
    const activateAccountLink = `${process.env.API_BASE_URL}/auth/activate/${token}`;

    const courier = new CourierClient({ authorizationToken: process.env.COURIER_AUTH_TOKEN });

    await courier.send({
      message: {
        to: { email: userEmail },
        template: "57PER982K9405GJ632MWVJ8M2DWY",
        data: { userName, activateAccountLink }
      }
    });

    return true;
  }
}
