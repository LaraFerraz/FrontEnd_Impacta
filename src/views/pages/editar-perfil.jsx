import React, { useState } from 'react';
import { useAuth } from '../../controllers/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../controllers/hooks/useToast';
import './editar-perfil.css';

const EditarPerfil = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [formData, setFormData] = useState({
        nome: user?.nome || '',
        email: user?.email || '',
        password: '',
        confirmPassword: '',
        cpf: user?.cpf || ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.nome) {
            newErrors.nome = 'Nome obrigatório';
        }

        if (formData.password) {
            if (!/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
                newErrors.password = 'Senha fraca';
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Senhas não coincidem';
            }
        }

        if (!formData.cpf) {
            newErrors.cpf = 'CPF obrigatório';
        } else if (!/^\d{11}$/.test(formData.cpf.replace(/\D/g, ''))) {
            newErrors.cpf = 'CPF inválido';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...data } = formData;

            await updateUser(data);

            showSuccess('Perfil atualizado!');
            navigate('/perfil');

        } catch (err) {
            showError('Erro ao atualizar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="editar-container">
            <div className="editar-content">

                <div className="editar-header">
                    <h1>Editar Perfil</h1>
                </div>

                <div className="editar-card">
                    <form onSubmit={handleSubmit}>

                        <div className="form-section">

                            <div className="form-group">
                                <label>Nome</label>
                                <input name="nome" value={formData.nome} onChange={handleChange} />
                                {errors.nome && <span className="error-message">{errors.nome}</span>}
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={formData.email} disabled />
                            </div>

                            <div className="form-group">
                                <label>CPF</label>
                                <input name="cpf" value={formData.cpf} onChange={handleChange} />
                                {errors.cpf && <span className="error-message">{errors.cpf}</span>}
                            </div>

                            <div className="form-group">
                                <label>Nova Senha</label>
                                <input type="password" name="password" onChange={handleChange} />
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>

                            <div className="form-group">
                                <label>Confirmar Senha</label>
                                <input type="password" name="confirmPassword" onChange={handleChange} />
                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                            </div>

                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => navigate('/perfil')}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default EditarPerfil;