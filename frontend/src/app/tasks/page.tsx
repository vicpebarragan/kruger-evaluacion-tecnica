'use client';

import { useFormWithSchema } from '@/hooks/useFormWithSchema';
import { projectService } from '@/services/project';
import { taskService } from '@/services/task';
import { useAuthStore } from '@/store';
import { ProjectResponse, TaskFilters, TaskFormData, TaskResponse, UserResponse } from '@/types';
import { taskSchema } from '@/utils/schemas';
import {
    ArrowLeftOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    FilterOutlined,
    PlusOutlined
} from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    DatePicker,
    Drawer,
    Input,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Tag,
    Typography
} from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function TasksPage() {
    const router = useRouter();
    const { isAuthenticated, initialize } = useAuthStore();
    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<TaskResponse[]>([]);
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);
    const [filters, setFilters] = useState<TaskFilters>({});

    const methods = useFormWithSchema({
        schema: taskSchema,
        defaultValues: {
            title: '',
            description: '',
            status: 'PENDING',
            dueDate: '',
            assignedToId: undefined,
            projectId: 0,
        } as Partial<TaskFormData>,
    });

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        if (isAuthenticated) {
            loadData();
        }
    }, [isAuthenticated]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [tasksResponse, projectsResponse, usersResponse] = await Promise.all([
                taskService.getUserTasks(),
                projectService.getUserProjects(),
                taskService.getAllUsers()
            ]);

            if (tasksResponse.success && tasksResponse.data) {
                setTasks(tasksResponse.data);
            }

            if (projectsResponse.success && projectsResponse.data) {
                setProjects(projectsResponse.data);
            }

            if (usersResponse.success && usersResponse.data) {
                setUsers(usersResponse.data);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            message.error('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = useCallback(() => {
        let filtered = [...tasks];

        if (filters.status) {
            filtered = filtered.filter(task => task.status === filters.status);
        }

        if (filters.dateFrom) {
            filtered = filtered.filter(task =>
                task.dueDate && new Date(task.dueDate) >= new Date(filters.dateFrom!)
            );
        }

        if (filters.dateTo) {
            filtered = filtered.filter(task =>
                task.dueDate && new Date(task.dueDate) <= new Date(filters.dateTo!)
            );
        }

        // Ordenar por fecha de vencimiento
        filtered.sort((a, b) => {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });

        setFilteredTasks(filtered);
    }, [tasks, filters]);

    useEffect(() => {
        applyFilters();
    }, [tasks, filters, applyFilters]);

    const handleCreateTask = () => {
        setEditingTask(null);
        methods.reset({
            title: '',
            description: '',
            status: 'PENDING',
            dueDate: '',
            assignedToId: undefined,
            projectId: projects.length > 0 ? projects[0].id : 0,
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
                    loadData();
                    setModalVisible(false);
                }
            } else {
                const response = await taskService.createTask(data);
                if (response.success) {
                    message.success('Tarea creada exitosamente');
                    loadData();
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
                loadData();
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

    const columns = [
        {
            title: 'Tarea',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: TaskResponse) => (
                <div>
                    <Text strong className='text-slate-800'>{text || 'Sin título'}</Text>
                    <br />
                    <Text type='secondary' className='text-xs'>
                        {(record.description || '').length > 50
                            ? `${(record.description || '').substring(0, 50)}...`
                            : (record.description || 'Sin descripción')
                        }
                    </Text>
                </div>
            ),
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
                    {status.replace('_', ' ')}
                </Tag>
            ),
        },
        {
            title: 'Proyecto',
            dataIndex: 'project',
            key: 'project',
            render: (project: number) => {
                const projectE = projects.find(p => p.id === project);
                return projectE ? projectE.name : 'N/A';
            },
        },
        {
            title: 'Fecha de Vencimiento',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (date: string) => (
                date ? dayjs(date).format('DD/MM/YYYY') : 'Sin fecha'
            ),
        },
        {
            title: 'Asignado a',
            dataIndex: 'assignedTo',
            key: 'assignedTo',
            render: (assignedTo: string) => assignedTo || 'Sin asignar',
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_: unknown, record: TaskResponse) => (
                <Space>
                    <Button
                        type='text'
                        icon={<EditOutlined />}
                        onClick={() => handleEditTask(record)}
                        className='text-blue-600'
                    >
                        Editar
                    </Button>
                    <Popconfirm
                        title='¿Estás seguro de eliminar esta tarea?'
                        onConfirm={() => handleDeleteTask(record.id)}
                        okText='Sí'
                        cancelText='No'
                    >
                        <Button
                            type='text'
                            icon={<DeleteOutlined />}
                            className='text-red-600'
                        >
                            Eliminar
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

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
                            <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center'>
                                <CalendarOutlined className='text-white text-lg' />
                            </div>
                            <Title level={4} className='text-white m-0'>
                                Gestión de Tareas
                            </Title>
                        </div>

                        <Space>
                            <Button
                                icon={<FilterOutlined />}
                                onClick={() => setFilterDrawerVisible(true)}
                                className='text-slate-300 hover:text-white'
                            >
                                Filtros
                            </Button>
                            <Button
                                type='primary'
                                icon={<PlusOutlined />}
                                onClick={handleCreateTask}
                                className='bg-blue-600 hover:bg-blue-700'
                            >
                                Nueva Tarea
                            </Button>
                        </Space>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <Card className='bg-white/95 backdrop-blur-sm border-0 shadow-xl'>
                    <Table
                        columns={columns}
                        dataSource={filteredTasks}
                        loading={loading}
                        rowKey='id'
                        pagination={{
                            pageSize: 10,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} de ${total} tareas`,
                        }}
                        locale={{
                            emptyText: (
                                <div className='text-center py-8'>
                                    <CalendarOutlined className='text-4xl text-slate-400 mb-4' />
                                    <Text className='text-slate-500'>
                                        No hay tareas disponibles
                                    </Text>
                                </div>
                            )
                        }}
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
                                Proyecto
                            </label>
                            <Controller
                                name="projectId"
                                control={methods.control}
                                render={({ field, fieldState }) => (
                                    <Select
                                        {...field}
                                        size='large'
                                        className='w-full'
                                        placeholder='Selecciona un proyecto'
                                        status={fieldState.error ? 'error' : ''}
                                    >
                                        {projects.map(project => (
                                            <Option key={project.id} value={project.id}>
                                                {project.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            />
                        </Col>
                    </Row>

                    <Row gutter={16}>
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
                        <Col span={12}>
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

            {/* Filters Drawer */}
            <Drawer
                title='Filtros de Tareas'
                placement='right'
                onClose={() => setFilterDrawerVisible(false)}
                open={filterDrawerVisible}
                width={300}
            >
                <div className='space-y-4'>
                    <div>
                        <label className='block text-slate-700 mb-2 font-medium'>
                            Estado
                        </label>
                        <Select
                            value={filters.status}
                            onChange={(value) => setFilters({ ...filters, status: value })}
                            className='w-full'
                            placeholder='Todos los estados'
                            allowClear
                        >
                            <Option value='PENDING'>Pendiente</Option>
                            <Option value='IN_PROGRESS'>En Progreso</Option>
                            <Option value='DONE'>Completada</Option>
                        </Select>
                    </div>

                    <div>
                        <label className='block text-slate-700 mb-2 font-medium'>
                            Fecha Desde
                        </label>
                        <DatePicker
                            value={filters.dateFrom ? dayjs(filters.dateFrom) : null}
                            onChange={(date) => setFilters({
                                ...filters,
                                dateFrom: date ? date.format('YYYY-MM-DD') : undefined
                            })}
                            className='w-full'
                            placeholder='Fecha desde'
                        />
                    </div>

                    <div>
                        <label className='block text-slate-700 mb-2 font-medium'>
                            Fecha Hasta
                        </label>
                        <DatePicker
                            value={filters.dateTo ? dayjs(filters.dateTo) : null}
                            onChange={(date) => setFilters({
                                ...filters,
                                dateTo: date ? date.format('YYYY-MM-DD') : undefined
                            })}
                            className='w-full'
                            placeholder='Fecha hasta'
                        />
                    </div>

                    <Button
                        type='primary'
                        onClick={() => setFilters({})}
                        className='w-full'
                    >
                        Limpiar Filtros
                    </Button>
                </div>
            </Drawer>
        </div>
    );
}
