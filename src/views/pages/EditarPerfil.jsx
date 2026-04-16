import React, { useState } from 'react';
import { useAuth } from '../../controllers/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../controllers/hooks/useToast';
import { validateEditarPerfilForm } from '../../controllers/utils/validation';
import { formatPhone } from '../../controllers/utils/formatters';
import { TIMEOUTS, MESSAGES } from '../../controllers/utils/constants';
import './EditarPerfil.css';

const EditarPerfil = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [formData, setFormData] = useState({
        nome: user?.nome || '',
        email: user?.email || '',
        password: '',
        confirmPassword: '',
        cpf: user?.cpf || '',
        telefone: user?.telefone || ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        let updatedValue = value;
        
        // Formatar telefone ao digitar
        if (name === 'telefone') {
            updatedValue = formatPhone(value);
        }
        
        setFormData({
            ...formData,
            [name]: updatedValue
        });

        // Remover erro quando usuário começa a digitar
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateEditarPerfilForm(formData);
        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            // Construir objeto com apenas os campos que foram alterados
            const { confirmPassword, cpf, ...data } = formData;
            
            // Remover campos vazios de senha
            if (!data.password || !data.password.trim()) {
                delete data.password;
            }

            await updateUser(data);

            showSuccess(MESSAGES.PERFIL.UPDATE_SUCCESS);
            setTimeout(() => navigate('/perfil'), TIMEOUTS.REDIRECT_DELAY);

        } catch (err) {
            showError(MESSAGES.PERFIL.UPDATE_ERROR);
            console.error('Erro:', err);
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
                                <input 
                                    name="cpf" 
                                    value={formData.cpf} 
                                    disabled
                                />
                                <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                                    CPF não pode ser alterado
                                </p>
                            </div>

                            <div className="form-group">
                                <label>Telefone</label>
                                <input 
                                    name="telefone" 
                                    value={formData.telefone} 
                                    onChange={handleChange}
                                    placeholder="(11) 9999-9999"
                                />
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