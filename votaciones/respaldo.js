"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var cron = require("node-cron");
// Configura tus conexiones a las bases de datos
var sourcePool = new pg_1.Pool({
    host: 'aws-0-sa-east-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.mpxjwyjrwkritzhafmhk',
    password: 'Seiya.13052610',
    database: 'postgres',
});
var targetPool = new pg_1.Pool({
    host: 'aws-0-sa-east-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.zipvngvpszqyodscwkxg',
    password: 'Seiya.13052610',
    database: 'postgres',
});
// Función para obtener la clave primaria de la tabla
function getPrimaryKey(client, tableName) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.query("\n    SELECT a.attname\n    FROM   pg_index i\n    JOIN   pg_attribute a ON a.attrelid = i.indrelid\n        AND a.attnum = ANY(i.indkey)\n    WHERE  i.indrelid = $1::regclass\n    AND    i.indisprimary\n  ", [tableName])];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.rows.length > 0 ? res.rows[0].attname : null]; // Devolver el nombre de la columna primaria
            }
        });
    });
}
// Función para sincronizar las tablas
function syncTable(tableName) {
    return __awaiter(this, void 0, void 0, function () {
        var sourceClient, targetClient, res, primaryKey, _i, _a, row, existsRes, columns, values, placeholders, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, sourcePool.connect()];
                case 1:
                    sourceClient = _b.sent();
                    return [4 /*yield*/, targetPool.connect()];
                case 2:
                    targetClient = _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 11, 12, 13]);
                    return [4 /*yield*/, sourceClient.query("SELECT * FROM ".concat(tableName))];
                case 4:
                    res = _b.sent();
                    return [4 /*yield*/, getPrimaryKey(sourceClient, tableName)];
                case 5:
                    primaryKey = _b.sent();
                    _i = 0, _a = res.rows;
                    _b.label = 6;
                case 6:
                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                    row = _a[_i];
                    return [4 /*yield*/, targetClient.query("SELECT * FROM ".concat(tableName, " WHERE ").concat(primaryKey, " = $1"), [row[primaryKey]])];
                case 7:
                    existsRes = _b.sent();
                    if (!(existsRes.rows.length === 0)) return [3 /*break*/, 9];
                    columns = Object.keys(row).join(', ');
                    values = Object.values(row);
                    placeholders = values.map(function (_, index) { return "$".concat(index + 1); }).join(', ');
                    return [4 /*yield*/, targetClient.query("INSERT INTO ".concat(tableName, " (").concat(columns, ") VALUES (").concat(placeholders, ")"), values)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 6];
                case 10: return [3 /*break*/, 13];
                case 11:
                    err_1 = _b.sent();
                    console.error("Error synchronizing table ".concat(tableName, ":"), err_1);
                    return [3 /*break*/, 13];
                case 12:
                    // Asegúrate de liberar las conexiones incluso si ocurre un error
                    sourceClient.release();
                    targetClient.release();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
// Función para obtener las tablas y sincronizarlas
function syncAllTables() {
    return __awaiter(this, void 0, void 0, function () {
        var client, res, _i, _a, row, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, sourcePool.connect()];
                case 1:
                    client = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 8, 9, 10]);
                    return [4 /*yield*/, client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")];
                case 3:
                    res = _b.sent();
                    _i = 0, _a = res.rows;
                    _b.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    row = _a[_i];
                    return [4 /*yield*/, syncTable(row.table_name)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    console.log('Synchronization completed successfully.');
                    return [3 /*break*/, 10];
                case 8:
                    err_2 = _b.sent();
                    console.error('Error syncing all tables:', err_2);
                    return [3 /*break*/, 10];
                case 9:
                    // Asegúrate de liberar la conexión
                    client.release();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
// Programar la tarea para que se ejecute cada 10 minutos
cron.schedule('*/10 * * * *', function () {
    console.log('Starting synchronization...');
    syncAllTables().catch(function (err) { return console.error('Error during synchronization:', err); });
});
