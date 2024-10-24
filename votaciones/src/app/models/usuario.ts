export interface Usuario {
    id_usuario: number;
    dni: number;
    password: string;
    pnombre: string;
    snombre: string
    appaterno: string;
    apmaterno: string;
    telefono: number;
    email: string;
    id_rol: number;
    rolNombre?: string;
    habilitado: boolean;
    foto_portada: string;
    fecha_afiliacion: string;
    id_estado: number;
}
