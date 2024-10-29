import { UsuarioCandidato } from "./ususarioCandidato";

export interface Candidato {
    id_candidato: number;
    id_votacion: number;
    id_usuario: number;
    pnombre: string;
    appaterno: string;
    apmaterno: string;
    descripcion: string;
    propuestas: [string];
    experiencia: [string];
    usuario:UsuarioCandidato;
}