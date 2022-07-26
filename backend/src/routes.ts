/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {
	Controller,
	ValidationService,
	FieldErrors,
	ValidateError,
	TsoaRoute,
	HttpStatusCodeLiteral,
	TsoaResponse,
	fetchMiddlewares,
} from "@tsoa/runtime";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ControllerPlaylists } from "./controllers/ControllerPlaylists";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ControllerUsers } from "./controllers/ControllerUsers";
import type { RequestHandler } from "express";
import * as express from "express";

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
	"ResponsePlaylistGetAll": {
		"dataType": "refObject",
		"properties": {
			"playlist_ids": { "dataType": "array", "array": { "dataType": "double" }, "required": true },
			"user_uuids": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
			"titles": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
			"descriptions": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
			"is_success": { "dataType": "boolean", "required": true },
			"error_code": { "dataType": "double", "required": true },
			"error_msg": { "dataType": "string", "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	"RequestPlaylistGetAll": {
		"dataType": "refObject",
		"properties": {
			"session_hash": { "dataType": "string", "required": true },
			"user_uuid": { "dataType": "string", "required": true },
			"request_hash": { "dataType": "string", "required": true },
			"timestamp": { "dataType": "double", "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	"ResponsePlaylistCreate": {
		"dataType": "refObject",
		"properties": {
			"playlist_id": { "dataType": "double", "required": true },
			"is_success": { "dataType": "boolean", "required": true },
			"error_code": { "dataType": "double", "required": true },
			"error_msg": { "dataType": "string", "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	"RequestPlaylistCreate": {
		"dataType": "refObject",
		"properties": {
			"session_hash": { "dataType": "string", "required": true },
			"user_uuid": { "dataType": "string", "required": true },
			"request_hash": { "dataType": "string", "required": true },
			"timestamp": { "dataType": "double", "required": true },
			"title": { "dataType": "string", "required": true },
			"description": { "dataType": "string", "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	"ResponseUserRegister": {
		"dataType": "refObject",
		"properties": {
			"user_uuid": { "dataType": "string", "required": true },
			"is_success": { "dataType": "boolean", "required": true },
			"error_code": { "dataType": "double", "required": true },
			"error_msg": { "dataType": "string", "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	"RequestUserRegister": {
		"dataType": "refObject",
		"properties": {
			"request_hash": { "dataType": "string", "required": true },
			"timestamp": { "dataType": "double", "required": true },
			"username": { "dataType": "string", "required": true },
			"password_hash": { "dataType": "string", "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	"ResponseUserLogin": {
		"dataType": "refObject",
		"properties": {
			"session_hash": { "dataType": "string", "required": true },
			"user_uuid": { "dataType": "string", "required": true },
			"is_success": { "dataType": "boolean", "required": true },
			"error_code": { "dataType": "double", "required": true },
			"error_msg": { "dataType": "string", "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	"RequestUserLogin": {
		"dataType": "refObject",
		"properties": {
			"request_hash": { "dataType": "string", "required": true },
			"timestamp": { "dataType": "double", "required": true },
			"username": { "dataType": "string", "required": true },
			"password_hash": { "dataType": "string", "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Router) {
	// ###########################################################################################################
	//  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
	//      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
	// ###########################################################################################################
	app.post("/playlists/all",
		...(fetchMiddlewares<RequestHandler>(ControllerPlaylists)),
		...(fetchMiddlewares<RequestHandler>(ControllerPlaylists.prototype.GetAllPlaylists)),

		function ControllerPlaylists_GetAllPlaylists(request: any, response: any, next: any) {
			const args = {
				request: { "in": "body", "name": "request", "required": true, "ref": "RequestPlaylistGetAll" },
			};

			// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

			let validatedArgs: any[] = [];
			try {
				validatedArgs = getValidatedArgs(args, request, response);

				const controller = new ControllerPlaylists();


				const promise = controller.GetAllPlaylists.apply(controller, validatedArgs as any);
				promiseHandler(controller, promise, response, undefined, next);
			} catch (err) {
				return next(err);
			}
		});
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	app.post("/playlists/create",
		...(fetchMiddlewares<RequestHandler>(ControllerPlaylists)),
		...(fetchMiddlewares<RequestHandler>(ControllerPlaylists.prototype.CreatePlaylist)),

		function ControllerPlaylists_CreatePlaylist(request: any, response: any, next: any) {
			const args = {
				request: { "in": "body", "name": "request", "required": true, "ref": "RequestPlaylistCreate" },
			};

			// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

			let validatedArgs: any[] = [];
			try {
				validatedArgs = getValidatedArgs(args, request, response);

				const controller = new ControllerPlaylists();


				const promise = controller.CreatePlaylist.apply(controller, validatedArgs as any);
				promiseHandler(controller, promise, response, undefined, next);
			} catch (err) {
				return next(err);
			}
		});
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	app.post("/users/register",
		...(fetchMiddlewares<RequestHandler>(ControllerUsers)),
		...(fetchMiddlewares<RequestHandler>(ControllerUsers.prototype.Register)),

		function ControllerUsers_Register(request: any, response: any, next: any) {
			const args = {
				request: { "in": "body", "name": "request", "required": true, "ref": "RequestUserRegister" },
			};

			// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

			let validatedArgs: any[] = [];
			try {
				validatedArgs = getValidatedArgs(args, request, response);

				const controller = new ControllerUsers();


				const promise = controller.Register.apply(controller, validatedArgs as any);
				promiseHandler(controller, promise, response, undefined, next);
			} catch (err) {
				return next(err);
			}
		});
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	app.post("/users/login",
		...(fetchMiddlewares<RequestHandler>(ControllerUsers)),
		...(fetchMiddlewares<RequestHandler>(ControllerUsers.prototype.Login)),

		function ControllerUsers_Login(request: any, response: any, next: any) {
			const args = {
				request: { "in": "body", "name": "request", "required": true, "ref": "RequestUserLogin" },
			};

			// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

			let validatedArgs: any[] = [];
			try {
				validatedArgs = getValidatedArgs(args, request, response);

				const controller = new ControllerUsers();


				const promise = controller.Login.apply(controller, validatedArgs as any);
				promiseHandler(controller, promise, response, undefined, next);
			} catch (err) {
				return next(err);
			}
		});
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

	function isController(object: any): object is Controller {
		return "getHeaders" in object && "getStatus" in object && "setStatus" in object;
	}

	function promiseHandler(controllerObj: any, promise: any, response: any, successStatus: any, next: any) {
		return Promise.resolve(promise)
			.then((data: any) => {
				let statusCode = successStatus;
				let headers;
				if (isController(controllerObj)) {
					headers = controllerObj.getHeaders();
					statusCode = controllerObj.getStatus() || statusCode;
				}

				// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

				returnHandler(response, statusCode, data, headers);
			})
			.catch((error: any) => next(error));
	}

	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

	function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
		if (response.headersSent) {
			return;
		}
		Object.keys(headers).forEach((name: string) => {
			response.set(name, headers[name]);
		});
		if (data && typeof data.pipe === "function" && data.readable && typeof data._read === "function") {
			data.pipe(response);
		} else if (data !== null && data !== undefined) {
			response.status(statusCode || 200).json(data);
		} else {
			response.status(statusCode || 204).end();
		}
	}

	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

	function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown> {
		return function(status, data, headers) {
			returnHandler(response, status, data, headers);
		};
	};

	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

	function getValidatedArgs(args: any, request: any, response: any): any[] {
		const fieldErrors: FieldErrors = {};
		const values = Object.keys(args).map((key) => {
			const name = args[key].name;
			switch (args[key].in) {
				case "request":
					return request;
				case "query":
					return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
				case "path":
					return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
				case "header":
					return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
				case "body":
					return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
				case "body-prop":
					return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, "body.", { "noImplicitAdditionalProperties": "throw-on-extras" });
				case "formData":
					if (args[key].dataType === "file") {
						return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
					} else if (args[key].dataType === "array" && args[key].array.dataType === "file") {
						return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
					} else {
						return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
					}
				case "res":
					return responder(response);
			}
		});

		if (Object.keys(fieldErrors).length > 0) {
			throw new ValidateError(fieldErrors, "");
		}
		return values;
	}

	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
