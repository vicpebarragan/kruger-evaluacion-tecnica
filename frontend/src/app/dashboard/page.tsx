'use client';

import { projectService } from '@/services/project';
import { taskService } from '@/services/task';
import { useAuthStore } from '@/store';
import { ProjectResponse, TaskResponse } from '@/types';
import {
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DashboardOutlined,
    ExclamationCircleOutlined,
    LogoutOutlined,
    PlusOutlined,
    ProjectOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    List,
    Row,
    Space,
    Statistic,
    Tag,
    Typography,
    message
} from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, initialize, logout } = useAuthStore();
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        if (isAuthenticated) {
            loadDashboardData();
        }
    }, [isAuthenticated]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [projectsResponse, tasksResponse] = await Promise.all([
                projectService.getUserProjects(),
                taskService.getUserTasks()
            ]);

            if (projectsResponse.success && projectsResponse.data) {
                setProjects(projectsResponse.data);
            }

            if (tasksResponse.success && tasksResponse.data) {
                setTasks(tasksResponse.data);
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            message.error('Error al cargar los datos del dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const getTaskStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'orange';
            case 'IN_PROGRESS': return 'blue';
            case 'DONE': return 'green';
            default: return 'default';
        }
    };

    const getTaskStatusIcon = (status: string) => {
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
                            <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center'>
                                <DashboardOutlined className='text-white text-lg' />
                            </div>
                            <Title level={4} className='text-white m-0'>
                                Dashboard
                            </Title>
                        </div>

                        <div className='flex items-center space-x-4'>
                            <div className='text-right'>
                                <Text className='text-slate-300 text-sm block'>
                                    {user?.username}
                                </Text>
                                <Text className='text-slate-400 text-xs'>
                                    {user?.email}
                                </Text>
                            </div>
                            <Button
                                type='text'
                                icon={<LogoutOutlined />}
                                onClick={handleLogout}
                                className='text-slate-300 hover:text-white'
                            >
                                Salir
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Welcome Section */}
                <div className='mb-8'>
                    <Title level={2} className='text-white mb-2'>
                        ¡Bienvenido, {user?.username}! 👋
                    </Title>
                    <Text className='text-slate-400 text-lg'>
                        Aquí tienes un resumen de tus proyectos y tareas
                    </Text>
                </div>

                {/* Statistics Cards */}
                <Row gutter={[16, 16]} className='mb-8'>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className='bg-slate-800/50 border-slate-700'>
                            <Statistic
                                title={<span className='text-slate-300'>Total Proyectos</span>}
                                value={projects.length}
                                prefix={<ProjectOutlined className='text-purple-500' />}
                                valueStyle={{ color: '#a855f7' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className='bg-slate-800/50 border-slate-700'>
                            <Statistic
                                title={<span className='text-slate-300'>Total Tareas</span>}
                                value={taskStats.total}
                                prefix={<CalendarOutlined className='text-blue-500' />}
                                valueStyle={{ color: '#3b82f6' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className='bg-slate-800/50 border-slate-700'>
                            <Statistic
                                title={<span className='text-slate-300'>En Progreso</span>}
                                value={taskStats.inProgress}
                                prefix={<ClockCircleOutlined className='text-yellow-500' />}
                                valueStyle={{ color: '#eab308' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
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

                {/* Projects and Tasks Grid */}
                <Row gutter={[24, 24]}>
                    {/* Projects Section */}
                    <Col xs={24} lg={12}>
                        <Card
                            className='bg-slate-800/50 border-slate-700 h-full'
                            title={
                                <div className='flex justify-between items-center'>
                                    <span className='text-white flex items-center gap-2'>
                                        <ProjectOutlined />
                                        Mis Proyectos
                                    </span>
                                    <Button
                                        type='primary'
                                        size='small'
                                        icon={<PlusOutlined />}
                                        onClick={() => router.push('/projects')}
                                        className='bg-purple-600 hover:bg-purple-700'
                                    >
                                        Nuevo
                                    </Button>
                                </div>
                            }
                        >
                            <List
                                loading={loading}
                                dataSource={projects.slice(0, 5)}
                                locale={{
                                    emptyText: (
                                        <div className='text-center py-8'>
                                            <ProjectOutlined className='text-4xl text-slate-500 mb-4' />
                                            <Text className='text-slate-400'>
                                                No tienes proyectos aún
                                            </Text>
                                        </div>
                                    )
                                }}
                                renderItem={(project) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                key='view'
                                                type='text'
                                                size='small'
                                                onClick={() => router.push(`/projects/${project.id}`)}
                                                className='text-purple-400 hover:text-purple-300'
                                            >
                                                Ver detalles
                                            </Button>
                                        ]}
                                        className='hover:bg-slate-700/30 rounded-lg px-3 transition-colors'
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    shape='square'
                                                    size='large'
                                                    className='bg-gradient-to-r from-purple-500 to-blue-500'
                                                >
                                                    {project.name?.charAt(0)?.toUpperCase() || 'P'}
                                                </Avatar>
                                            }
                                            title={
                                                <span className='text-white'>
                                                    {project.name || 'Proyecto sin nombre'}
                                                </span>
                                            }
                                            description={
                                                <Text className='text-slate-400'>
                                                    {(project.description || '').length > 80
                                                        ? `${(project.description || '').substring(0, 80)}...`
                                                        : (project.description || 'Sin descripción')
                                                    }
                                                </Text>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                            {projects.length > 5 && (
                                <div className='text-center mt-4'>
                                    <Button
                                        type='link'
                                        onClick={() => router.push('/projects')}
                                        className='text-purple-400'
                                    >
                                        Ver todos los proyectos ({projects.length})
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </Col>

                    {/* Recent Tasks Section */}
                    <Col xs={24} lg={12}>
                        <Card
                            className='bg-slate-800/50 border-slate-700 h-full'
                            title={
                                <div className='flex justify-between items-center'>
                                    <span className='text-white flex items-center gap-2'>
                                        <CalendarOutlined />
                                        Tareas Recientes
                                    </span>
                                    <Button
                                        type='primary'
                                        size='small'
                                        icon={<PlusOutlined />}
                                        onClick={() => router.push('/tasks')}
                                        className='bg-blue-600 hover:bg-blue-700'
                                    >
                                        Ver todas
                                    </Button>
                                </div>
                            }
                        >
                            <List
                                loading={loading}
                                dataSource={tasks.slice(0, 5)}
                                locale={{
                                    emptyText: (
                                        <div className='text-center py-8'>
                                            <CalendarOutlined className='text-4xl text-slate-500 mb-4' />
                                            <Text className='text-slate-400'>
                                                No tienes tareas aún
                                            </Text>
                                        </div>
                                    )
                                }}
                                renderItem={(task) => (
                                    <List.Item className='hover:bg-slate-700/30 rounded-lg px-3 transition-colors'>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    icon={getTaskStatusIcon(task.status)}
                                                    className={`bg-${getTaskStatusColor(task.status)}-500`}
                                                />
                                            }
                                            title={
                                                <div className='flex justify-between items-center'>
                                                    <span className='text-white'>
                                                        {task.title || 'Tarea sin título'}
                                                    </span>
                                                    <Tag color={getTaskStatusColor(task.status)}>
                                                        {task.status}
                                                    </Tag>
                                                </div>
                                            }
                                            description={
                                                <div>
                                                    <Text className='text-slate-400 block'>
                                                        {(task.description || '').length > 60
                                                            ? `${(task.description || '').substring(0, 60)}...`
                                                            : (task.description || 'Sin descripción')
                                                        }
                                                    </Text>
                                                    {task.dueDate && (
                                                        <Text className='text-slate-500 text-xs'>
                                                            Vence: {new Date(task.dueDate).toLocaleDateString()}
                                                        </Text>
                                                    )}
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                            {tasks.length > 5 && (
                                <div className='text-center mt-4'>
                                    <Button
                                        type='link'
                                        onClick={() => router.push('/tasks')}
                                        className='text-blue-400'
                                    >
                                        Ver todas las tareas ({tasks.length})
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>

                {/* Quick Actions */}
                <div className='mt-8'>
                    <Card className='bg-slate-800/50 border-slate-700'>
                        <div className='text-center'>
                            <Title level={4} className='text-white mb-6'>
                                Acciones Rápidas
                            </Title>
                            <Space size='large'>
                                <Button
                                    type='primary'
                                    size='large'
                                    icon={<PlusOutlined />}
                                    onClick={() => router.push('/projects')}
                                    className='bg-purple-600 hover:bg-purple-700 h-12 px-8'
                                >
                                    Crear Proyecto
                                </Button>
                                <Button
                                    type='primary'
                                    size='large'
                                    icon={<CalendarOutlined />}
                                    onClick={() => router.push('/tasks')}
                                    className='bg-blue-600 hover:bg-blue-700 h-12 px-8'
                                >
                                    Gestionar Tareas
                                </Button>
                            </Space>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
