'use client';

import { useFormWithSchema } from '@/hooks/useFormWithSchema';
import { projectService } from '@/services/project';
import { useAuthStore } from '@/store';
import { ProjectFormData, ProjectResponse } from '@/types';
import { projectSchema } from '@/utils/schemas';
import {
    ArrowLeftOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ProjectOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Input,
    message,
    Modal,
    Popconfirm,
    Row,
    Typography
} from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ProjectsPage() {
    const router = useRouter();
    const { isAuthenticated, initialize } = useAuthStore();
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);

    const methods = useFormWithSchema({
        schema: projectSchema,
        defaultValues: {
            name: '',
            description: '',
        },
    });

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        if (isAuthenticated) {
            loadProjects();
        }
    }, [isAuthenticated]);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const response = await projectService.getUserProjects();

            if (response.success && response.data) {
                setProjects(response.data);
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            message.error('Error al cargar los proyectos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = () => {
        setEditingProject(null);
        methods.reset({
            name: '',
            description: '',
        });
        setModalVisible(true);
    };

    const handleEditProject = (project: ProjectResponse) => {
        setEditingProject(project);
        methods.reset({
            name: project.name || '',
            description: project.description || '',
        });
        setModalVisible(true);
    };

    const handleSubmit = async (data: ProjectFormData) => {
        try {
            if (editingProject) {
                const response = await projectService.updateProject(editingProject.id, data);
                if (response.success) {
                    message.success('Proyecto actualizado exitosamente');
                    loadProjects();
                    setModalVisible(false);
                }
            } else {
                const response = await projectService.createProject(data);
                if (response.success) {
                    message.success('Proyecto creado exitosamente');
                    loadProjects();
                    setModalVisible(false);
                }
            }
        } catch (error) {
            console.error('Error saving project:', error);
            message.error('Error al guardar el proyecto');
        }
    };

    const handleDeleteProject = async (projectId: number) => {
        try {
            const response = await projectService.deleteProject(projectId);
            if (response.success) {
                message.success('Proyecto eliminado exitosamente');
                loadProjects();
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            message.error('Error al eliminar el proyecto');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 animate-pulse'></div>
                    <Text className='text-slate-300'>Cargando...</Text>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
            {/* Header */}
            <div className='bg-slate-800/90 backdrop-blur-sm border-b border-slate-700'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        <div className='flex items-center space-x-3'>
                            <Button
                                type='text'
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.push('/dashboard')}
                                className='text-slate-300 hover:text-white'
                            >
                                Volver
                            </Button>
                            <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center'>
                                <ProjectOutlined className='text-white text-lg' />
                            </div>
                            <Title level={4} className='text-white m-0'>
                                Mis Proyectos
                            </Title>
                        </div>

                        <Button
                            type='primary'
                            icon={<PlusOutlined />}
                            onClick={handleCreateProject}
                            className='bg-purple-600 hover:bg-purple-700'
                        >
                            Nuevo Proyecto
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <Row gutter={[16, 16]}>
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <Col xs={24} sm={12} lg={8} key={index}>
                                <Card loading className='bg-slate-800/50 border-slate-700' />
                            </Col>
                        ))
                    ) : projects.length === 0 ? (
                        <Col span={24}>
                            <Card className='bg-slate-800/50 border-slate-700'>
                                <div className='text-center py-16'>
                                    <ProjectOutlined className='text-6xl text-slate-500 mb-4' />
                                    <Title level={3} className='text-slate-300 mb-4'>
                                        No tienes proyectos aún
                                    </Title>
                                    <Text className='text-slate-400 mb-6 block'>
                                        Crea tu primer proyecto para comenzar a organizar tus tareas
                                    </Text>
                                    <Button
                                        type='primary'
                                        size='large'
                                        icon={<PlusOutlined />}
                                        onClick={handleCreateProject}
                                        className='bg-purple-600 hover:bg-purple-700'
                                    >
                                        Crear Proyecto
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    ) : (
                        projects.map((project) => (
                            <Col xs={24} sm={12} lg={8} key={project.id}>
                                <Card
                                    className='bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer'
                                    actions={[
                                        <Button
                                            key='edit'
                                            type='text'
                                            icon={<EditOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditProject(project);
                                            }}
                                            className='text-blue-400 hover:text-blue-300'
                                        >
                                            Editar
                                        </Button>,
                                        <Popconfirm
                                            key='delete'
                                            title='¿Estás seguro de eliminar este proyecto?'
                                            description='Esta acción no se puede deshacer.'
                                            onConfirm={(e) => {
                                                e?.stopPropagation();
                                                handleDeleteProject(project.id);
                                            }}
                                            okText='Sí'
                                            cancelText='No'
                                        >
                                            <Button
                                                type='text'
                                                icon={<DeleteOutlined />}
                                                onClick={(e) => e.stopPropagation()}
                                                className='text-red-400 hover:text-red-300'
                                            >
                                                Eliminar
                                            </Button>
                                        </Popconfirm>
                                    ]}
                                    onClick={() => router.push(`/projects/${project.id}`)}
                                >
                                    <div className='flex items-start space-x-3'>
                                        <Avatar
                                            size={48}
                                            shape='square'
                                            className='bg-gradient-to-r from-purple-500 to-blue-500'
                                        >
                                            {project.name?.charAt(0)?.toUpperCase() || 'P'}
                                        </Avatar>
                                        <div className='flex-1'>
                                            <Title level={5} className='text-white mb-2'>
                                                {project.name || 'Proyecto sin nombre'}
                                            </Title>
                                            <Text className='text-slate-400 block mb-3'>
                                                {(project.description || '').length > 100
                                                    ? `${(project.description || '').substring(0, 100)}...`
                                                    : (project.description || 'Sin descripción')
                                                }
                                            </Text>
                                            <div className='flex justify-between items-center text-xs'>
                                                <Text className='text-slate-500'>
                                                    Por: {project.ownerUsername}
                                                </Text>
                                                <Text className='text-slate-500'>
                                                    {new Date(project.createdAt).toLocaleDateString()}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            </div>

            {/* Create/Edit Project Modal */}
            <Modal
                title={editingProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                className='custom-modal'
            >
                <form onSubmit={methods.handleSubmit(handleSubmit)} className='space-y-4'>
                    <div>
                        <label className='block text-slate-700 mb-2 font-medium'>
                            Nombre del Proyecto
                        </label>
                        <Controller
                            name="name"
                            control={methods.control}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    placeholder='Ingresa el nombre del proyecto'
                                    size='large'
                                    status={fieldState.error ? 'error' : ''}
                                />
                            )}
                        />
                        {methods.formState.errors.name && (
                            <p className='text-red-500 text-sm mt-1'>
                                {methods.formState.errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className='block text-slate-700 mb-2 font-medium'>
                            Descripción
                        </label>
                        <Controller
                            name="description"
                            control={methods.control}
                            render={({ field, fieldState }) => (
                                <TextArea
                                    {...field}
                                    placeholder='Describe el proyecto'
                                    rows={4}
                                    status={fieldState.error ? 'error' : ''}
                                />
                            )}
                        />
                        {methods.formState.errors.description && (
                            <p className='text-red-500 text-sm mt-1'>
                                {methods.formState.errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className='flex justify-end space-x-3 pt-4'>
                        <Button onClick={() => setModalVisible(false)}>
                            Cancelar
                        </Button>
                        <Button
                            type='primary'
                            htmlType='submit'
                            loading={methods.formState.isSubmitting}
                            className='bg-purple-600 hover:bg-purple-700'
                        >
                            {editingProject ? 'Actualizar' : 'Crear'} Proyecto
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
