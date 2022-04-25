"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const form_data_1 = __importDefault(require("form-data"));
const mailgun_js_1 = __importDefault(require("mailgun.js"));
const logger_1 = __importDefault(require("./logger"));
const agenda_1 = __importDefault(require("./agenda"));
const config_1 = __importDefault(require("@/config"));
exports.default = ({ mongoConnection, models }) => {
    try {
        models.forEach(m => {
            typedi_1.Container.set(m.name, m.model);
        });
        const agendaInstance = agenda_1.default({ mongoConnection });
        const mgInstance = new mailgun_js_1.default(form_data_1.default);
        typedi_1.Container.set('agendaInstance', agendaInstance);
        typedi_1.Container.set('logger', logger_1.default);
        typedi_1.Container.set('emailClient', mgInstance.client({ key: config_1.default.emails.apiKey, username: config_1.default.emails.apiUsername }));
        typedi_1.Container.set('emailDomain', config_1.default.emails.domain);
        logger_1.default.info('✌️ Agenda injected into container');
        return { agenda: agendaInstance };
    }
    catch (e) {
        logger_1.default.error('🔥 Error on dependency injector loader: %o', e);
        throw e;
    }
};
//# sourceMappingURL=dependencyInjector.js.map