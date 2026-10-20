import {UsuarioRepository} 
    from "../repositories/usuarioRepository";
import {UsuarioAttributes} from "../models/Usuario";
import bcrypt from "bcryptjs";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/jwt";
import jwt  from "jsonwebtoken";

export class UsuarioService {
    private usuarioRepository : UsuarioRepository;

    constructor() {
        this.usuarioRepository = new UsuarioRepository();
    }

    async getAllUsuarios() {
        return await this.usuarioRepository.findAll();
    }

    async getUsuarioById(id: number) {
        const usuario = await this.usuarioRepository.findById(id);
        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }

        return usuario;
    }

    async createUsuario(usuarioData: Omit<UsuarioAttributes, "id">) {
        const senhaCripto = await bcrypt.hash(usuarioData.senha, 10);
        usuarioData.senha = senhaCripto;
        return await this.usuarioRepository.create(usuarioData);
    }

    async updateUsuario(id: number, usuarioData: Partial<UsuarioAttributes>) {
        const updatedUsuario = await this.usuarioRepository.update(id, usuarioData);    
    if (!updatedUsuario) {
        throw new Error("Usuário não encontrado");
        }   
    }

    async deleteUsuario(id: number, usuarioData: Partial<UsuarioAttributes>) {
        const deleted = await this.usuarioRepository.delete(id);      
    }

    async autenticar(email: string, senha: string) {
        const usuario = await this.usuarioRepository.findByEmail(email);

        if (!usuario) {
            throw new Error("Email ou senha inválido");
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            throw new Error("Email ou senha inválido");
        }

        const token = jwt.sign(
        { id: usuario.id, email: usuario.email, nome: usuario.nome },
        JWT_SECRET!,
        { expiresIn: "1h" }
    );

    return token;

    }

    // TODO: Criar a service de update e delete
}