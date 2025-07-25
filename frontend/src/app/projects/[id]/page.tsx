'use client';

import { useFormWithSchema } from '@/hooks/useFormWithSchema';
import { taskService } from '@/services/task';
import { useAuthStore } from '@/store';
import { ProjectResponse, TaskFormData, TaskResponse, UserResponse } from '@/types';
import { taskSchema } from '@/utils/schemas';
import {
    ArrowLeftOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    ProjectOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    DatePicker,
    Empty,
    Input,
    List,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Statistic,
    Tag,
    Typography
} from 'antd';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function ProjectDetailPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = parseInt(params.id as string);

    const { isAuthenticated, initialize } = useAuthStore();
    const [project, setProject] = useState<ProjectResponse | null>(null);
    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);

    const methods = useFormWithSchema({
        schema: taskSchema,
        defaultValues: {
            title: '',
            description: '',
            status: 'PENDING',
            dueDate: '',
            assignedToId: undefined,
            projectId: projectId,
        } as Partial<TaskFormData>,
    });

    useEffect(() => {
        initialize();
    }, [initialize]);

    const loadProjectData = useCallback(async () => {
        try {
            setLoading(true);
            const [tasksResponse, usersResponse] = await Promise.all([
                taskService.getTasksByProject(projectId),
                taskService.getAllUsers()
            ]);

            if (tasksResponse.success && tasksResponse.data) {
                setTasks(tasksResponse.data);
                // Simular datos del proyecto basado en las tareas
                if (tasksResponse.data.length > 0) {
                    // En una implementación real, obtendrías esto del proyecto
                    setProject({
                        id: projectId,
                        name: `Proyecto ${projectId}`,
                        description: 'Descripción del proyecto obtenida de las tareas',
                        createdAt: new Date().toISOString(),
                        ownerUsername: 'Usuario' // Simplificado ya que removimos user
                    } as ProjectResponse);
                }
            }

            if (usersResponse.success && usersResponse.data) {
                setUsers(usersResponse.data);
            }
        } catch (error) {
            console.error('Error loading project data:', error);
            message.error('Error al cargar los datos del proyecto');
        } finally {
            setLoading(false);
        }
    }, [projectId]); // Add dependency array for useCallback

    useEffect(() => {
        if (isAuthenticated && projectId) {
            loadProjectData();
        }
    }, [isAuthenticated, projectId, loadProjectData]);

    const handleCreateTask = () => {
        setEditingTask(null);
        methods.reset({
            title: '',
            description: '',
            status: 'PENDING' as const,
            dueDate: '',
            assignedToId: undefined,
            projectId: projectId,
        });
        setModalVisible(true);
    };

    const handleEditTask = (task: TaskResponse) => {
        setEditingTask(task);
        methods.reset({
            title: task.title || '',
            description: task.description || '',
            status: task.status,
            dueDate: task.dueDate || '',
            assignedToId: undefined, // TODO: Get from task.assignedTo
            projectId: task.projectId,
        });
        setModalVisible(true);
    };

    const handleSubmit = async (data: TaskFormData) => {
        try {
            if (editingTask) {
                const response = await taskService.updateTask(editingTask.id, data);
                if (response.success) {
                    message.success('Tarea actualizada exitosamente');
                    loadProjectData();
                    setModalVisible(false);
                }
            } else {
                const response = await taskService.createTask(data);
                if (response.success) {
                    message.success('Tarea creada exitosamente');
                    loadProjectData();
                    setModalVisible(false);
                }
            }
        } catch (error) {
            console.error('Error saving task:', error);
            message.error('Error al guardar la tarea');
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            const response = await taskService.deleteTask(taskId);
            if (response.success) {
                message.success('Tarea eliminada exitosamente');
                loadProjectData();
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            message.error('Error al eliminar la tarea');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'orange';
            case 'IN_PROGRESS': return 'blue';
            case 'DONE': return 'green';
            default: return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <ExclamationCircleOutlined />;
            case 'IN_PROGRESS': return <ClockCircleOutlined />;
            case 'DONE': return <CheckCircleOutlined />;
            default: return null;
        }
    };

    const taskStats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'PENDING').length,
        inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        done: tasks.filter(t => t.status === 'DONE').length,
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
                                onClick={() => router.push('/projects')}
                                className='text-slate-300 hover:text-white'
                            >
                                Volver
                            </Button>
                            <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center'>
                                <ProjectOutlined className='text-white text-lg' />
                            </div>
                            <Title level={4} className='text-white m-0'>
                                {project?.name || `Proyecto ${projectId}`}
                            </Title>
                        </div>

                        <Button
                            type='primary'
                            icon={<PlusOutlined />}
                            onClick={handleCreateTask}
                            className='bg-blue-600 hover:bg-blue-700'
                        >
                            Nueva Tarea
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Project Info */}
                {project && (
                    <Card className='bg-slate-800/50 border-slate-700 mb-8'>
                        <Row gutter={[24, 24]}>
                            <Col span={16}>
                                <div className='flex items-start space-x-4'>
                                    <Avatar
                                        size={64}
                                        shape='square'
                                        className='bg-gradient-to-r from-purple-500 to-blue-500'
                                    >
                                        {project.name?.charAt(0)?.toUpperCase() || 'P'}
                                    </Avatar>
                                    <div>
                                        <Title level={3} className='text-white mb-2'>
                                            {project.name || 'Proyecto sin nombre'}
                                        </Title>
                                        <Paragraph className='text-slate-400 mb-4'>
                                            {project.description || 'Sin descripción'}
                                        </Paragraph>
                                        <div className='flex items-center space-x-4 text-sm text-slate-500'>
                                            <span>
                                                <UserOutlined className='mr-1' />
                                                {project.ownerUsername}
                                            </span>
                                            <span>
                                                <CalendarOutlined className='mr-1' />
                                                {dayjs(project.createdAt).format('DD/MM/YYYY')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Statistic
                                            title={<span className='text-slate-300'>Total Tareas</span>}
                                            value={taskStats.total}
                                            valueStyle={{ color: '#3b82f6', fontSize: '20px' }}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic
                                            title={<span className='text-slate-300'>Completadas</span>}
                                            value={taskStats.done}
                                            valueStyle={{ color: '#10b981', fontSize: '20px' }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                )}

                {/* Task Statistics */}
                <Row gutter={[16, 16]} className='mb-8'>
                    <Col xs={24} sm={8}>
                        <Card className='bg-slate-800/50 border-slate-700'>
                            <Statistic
                                title={<span className='text-slate-300'>Pendientes</span>}
                                value={taskStats.pending}
                                prefix={<ExclamationCircleOutlined className='text-orange-500' />}
                                valueStyle={{ color: '#f59e0b' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className='bg-slate-800/50 border-slate-700'>
                            <Statistic
                                title={<span className='text-slate-300'>En Progreso</span>}
                                value={taskStats.inProgress}
                                prefix={<ClockCircleOutlined className='text-blue-500' />}
                                valueStyle={{ color: '#3b82f6' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className='bg-slate-800/50 border-slate-700'>
                            <Statistic
                                title={<span className='text-slate-300'>Completadas</span>}
                                value={taskStats.done}
                                prefix={<CheckCircleOutlined className='text-green-500' />}
                                valueStyle={{ color: '#10b981' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Tasks List */}
                <Card
                    className='bg-slate-800/50 border-slate-700'
                    title={
                        <div className='flex justify-between items-center'>
                            <span className='text-white flex items-center gap-2'>
                                <CalendarOutlined />
                                Tareas del Proyecto
                            </span>
                            <Button
                                type='primary'
                                size='small'
                                icon={<PlusOutlined />}
                                onClick={handleCreateTask}
                                className='bg-blue-600 hover:bg-blue-700'
                            >
                                Nueva Tarea
                            </Button>
                        </div>
                    }
                >
                    <List
                        loading={loading}
                        dataSource={tasks}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={<CalendarOutlined className='text-4xl text-slate-500' />}
                                    description={
                                        <Text className='text-slate-400'>
                                            No hay tareas en este proyecto
                                        </Text>
                                    }
                                >
                                    <Button
                                        type='primary'
                                        icon={<PlusOutlined />}
                                        onClick={handleCreateTask}
                                        className='bg-blue-600 hover:bg-blue-700'
                                    >
                                        Crear Primera Tarea
                                    </Button>
                                </Empty>
                            )
                        }}
                        renderItem={(task) => (
                            <List.Item
                                actions={[
                                    <Button
                                        key='edit'
                                        type='text'
                                        icon={<EditOutlined />}
                                        onClick={() => handleEditTask(task)}
                                        className='text-blue-400 hover:text-blue-300'
                                    >
                                        Editar
                                    </Button>,
                                    <Popconfirm
                                        key='delete'
                                        title='¿Estás seguro de eliminar esta tarea?'
                                        onConfirm={() => handleDeleteTask(task.id)}
                                        okText='Sí'
                                        cancelText='No'
                                    >
                                        <Button
                                            type='text'
                                            icon={<DeleteOutlined />}
                                            className='text-red-400 hover:text-red-300'
                                        >
                                            Eliminar
                                        </Button>
                                    </Popconfirm>
                                ]}
                                className='hover:bg-slate-700/30 rounded-lg px-3 transition-colors'
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            icon={getStatusIcon(task.status)}
                                            className={`bg-${getStatusColor(task.status)}-500`}
                                        />
                                    }
                                    title={
                                        <div className='flex justify-between items-center'>
                                            <span className='text-white'>
                                                {task.title}
                                            </span>
                                            <div className='flex items-center space-x-2'>
                                                <Tag color={getStatusColor(task.status)}>
                                                    {task.status.replace('_', ' ')}
                                                </Tag>
                                                {task.dueDate && (
                                                    <Text className='text-slate-500 text-xs'>
                                                        {dayjs(task.dueDate).format('DD/MM/YYYY')}
                                                    </Text>
                                                )}
                                            </div>
                                        </div>
                                    }
                                    description={
                                        <div>
                                            <Text className='text-slate-400 block mb-2'>
                                                {task.description}
                                            </Text>
                                            {task.assignedTo && (
                                                <Text className='text-slate-500 text-xs'>
                                                    Asignado a: {task.assignedTo}
                                                </Text>
                                            )}
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </div>

            {/* Create/Edit Task Modal */}
            <Modal
                title={editingTask ? 'Editar Tarea' : 'Crear Nueva Tarea'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={600}
            >
                <form onSubmit={methods.handleSubmit(handleSubmit)} className='space-y-4'>
                    <Row gutter={16}>
                        <Col span={24}>
                            <label className='block text-slate-700 mb-2 font-medium'>
                                Título de la Tarea
                            </label>
                            <Controller
                                name="title"
                                control={methods.control}
                                render={({ field, fieldState }) => (
                                    <Input
                                        {...field}
                                        placeholder='Ingresa el título de la tarea'
                                        size='large'
                                        status={fieldState.error ? 'error' : ''}
                                    />
                                )}
                            />
                            {methods.formState.errors.title && (
                                <p className='text-red-500 text-sm mt-1'>
                                    {methods.formState.errors.title.message}
                                </p>
                            )}
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <label className='block text-slate-700 mb-2 font-medium'>
                                Descripción
                            </label>
                            <Controller
                                name="description"
                                control={methods.control}
                                render={({ field, fieldState }) => (
                                    <TextArea
                                        {...field}
                                        placeholder='Describe la tarea'
                                        rows={3}
                                        status={fieldState.error ? 'error' : ''}
                                    />
                                )}
                            />
                            {methods.formState.errors.description && (
                                <p className='text-red-500 text-sm mt-1'>
                                    {methods.formState.errors.description.message}
                                </p>
                            )}
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <label className='block text-slate-700 mb-2 font-medium'>
                                Estado
                            </label>
                            <Controller
                                name="status"
                                control={methods.control}
                                render={({ field, fieldState }) => (
                                    <Select
                                        {...field}
                                        size='large'
                                        className='w-full'
                                        status={fieldState.error ? 'error' : ''}
                                    >
                                        <Option value='PENDING'>Pendiente</Option>
                                        <Option value='IN_PROGRESS'>En Progreso</Option>
                                        <Option value='DONE'>Completada</Option>
                                    </Select>
                                )}
                            />
                        </Col>
                        <Col span={12}>
                            <label className='block text-slate-700 mb-2 font-medium'>
                                Fecha de Vencimiento
                            </label>
                            <Controller
                                name="dueDate"
                                control={methods.control}
                                render={({ field }) => (
                                    <DatePicker
                                        {...field}
                                        value={field.value ? dayjs(field.value) : null}
                                        onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
                                        size='large'
                                        className='w-full'
                                        placeholder='Selecciona una fecha'
                                    />
                                )}
                            />
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <label className='block text-slate-700 mb-2 font-medium'>
                                Asignar a
                            </label>
                            <Controller
                                name="assignedToId"
                                control={methods.control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        size='large'
                                        className='w-full'
                                        placeholder='Asignar a usuario'
                                        allowClear
                                    >
                                        {users.map(user => (
                                            <Option key={user.id} value={user.id}>
                                                {user.username} ({user.email})
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            />
                        </Col>
                    </Row>

                    <div className='flex justify-end space-x-3 pt-4'>
                        <Button onClick={() => setModalVisible(false)}>
                            Cancelar
                        </Button>
                        <Button
                            type='primary'
                            htmlType='submit'
                            loading={methods.formState.isSubmitting}
                            className='bg-blue-600 hover:bg-blue-700'
                        >
                            {editingTask ? 'Actualizar' : 'Crear'} Tarea
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
