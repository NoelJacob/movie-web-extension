/**
 * Source: https://github.com/NirmalScaria/movie-web-extension/commit/cda573acd5060eab62f304e20bcebe0f368f6455
 * Repo: https://github.com/NirmalScaria/movie-web-extension
 */
import type { PlasmoMessaging } from '@plasmohq/messaging';
import type { BaseRequest } from '~types/request';
import type { BaseResponse } from '~types/response';

export interface Request extends BaseRequest {
  downloadUrl: string;
  location: string;
}

type Response = BaseResponse<{
  response: {
    statusCode: number;
  };
}>;

const handler: PlasmoMessaging.MessageHandler<Request, Response> = async (req, res) => {
  try {
    if (!req.sender?.tab?.url) throw new Error('No tab URL found in the request.');
    if (!req.body || !req.body.downloadUrl) throw new Error('No request body found in the request.');

    (chrome || browser).downloads.download({ url: req!.body!.downloadUrl!, filename: req!.body!.location! });

    res.send({
      success: true,
      response: {
        statusCode: 200,
      },
    }
    );
  } catch (err) {
    res.send({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export default handler;