import { Button, Input, message, Modal, Select, Space, Table, Tag, type TablePaginationConfig } from "antd";
import UserEditModal from "../components/UserEditModal";
import type { ColumnsType, FilterValue, SorterResult } from "antd/es/table/interface";
import { useEffect, useState, useCallback, type JSX } from "react";
import dayjs from "dayjs";
import filterEmptyParams from "../components/FilterParam.tsx";

interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    phone?: string;
    nickname?: string;
    avatar?: string;
    status?: boolean;
    role?: string;
    lastLoginAt?: string;
}

interface ApiResponse {
    records: User[];
    current: number;
    size: number;
    total: number;
}

export default function UserManage(): JSX.Element {
    const [users, setUsers] = useState<User[]>([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [username, setUsername] = useState<string | undefined>(undefined)
    const [status, setStatus] = useState<boolean>()
    const [role, setRole] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    // 从后端获取用户列表数据，后端必须返回分页数据，格式如下：
    const fetchUsers = useCallback(
        async (page = 1, pageSize = 10, username?: string, status?: boolean, role?: string) => {
            setLoading(true);
            try {
                // 构造请求参数
                const query = {
                    current: String(page) || "1",
                    pageSize: String(pageSize) || "10",
                    username: username,
                    status: status && String(status),
                    role: role,
                }

                const res = await fetch("http://localhost:8080/user/page", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(filterEmptyParams(query)),
                });

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                // 解析响应数据，并更新状态
                const result: ApiResponse = (await res.json())!.data;

                setUsers(result!.records);
                setPagination((p) => ({
                    ...p,
                    current: result!.current,
                    pageSize: result!.size,
                    total: result!.total,
                }));
            } catch (err) {
                console.log(err);
                message.error("加载用户失败");
            } finally {
                setLoading(false);
            }
        }, []
    );

    // 初始化：组件挂载时，加载用户数据
    useEffect(() => {
        fetchUsers(pagination.current || 1, pagination.pageSize || 10);
    }, []);


    // 搜索
    const handleSearch = () => {
        console.log("触发搜索事件")
        fetchUsers(1, pagination.pageSize, username, status, role);
    };

    // 当表格触发分页/排序/筛选变化时的回调（注意：明确类型，避免 implicit any）
    const handleTableChange = (
        pag: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<User> | SorterResult<User>[]
    ) => {
        console.log("触发表格变化事件");
        const page = pag.current ?? 1;
        const pageSize = pag.pageSize ?? 10;
        const total = pag.total ?? 0;


        // 1) 触发表格翻页时，调用后端接口拿对应页数据
        fetchUsers(page, pageSize, username, status, role);

        // 2) 可选：在本地也更新 pagination 状态（以保持受控）
        setPagination((prev) => ({
            ...prev,
            current: page,
            pageSize,
            total
        }));
    };

    // 过滤搜索结果
    // const filterUsers = users.filter(
    //     (user) => user.username.toLowerCase().includes(search.toLowerCase())
    //         || user.email.toLowerCase().includes(search.toLowerCase())
    // )

    const handleEdit = (id: number) => {
        const user = users.find(u => u.id === id);
        if (user) {
            setCurrentUser(user);
            setEditModalVisible(true);
        }
    };

    const handleSaveUser = async (user: User) => {
        setSaveLoading(true);
        try {
            // 这里调用API保存用户
            const res = await fetch(`http://localhost:8080/user/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            // 更新本地状态
            setUsers(users.map(u => u.id === user.id ? user : u));
            message.success("用户信息更新成功");
            setEditModalVisible(false);
        } catch (err) {
            console.error(err);
            message.error("更新用户信息失败");
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要逻辑删除这个用户吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const res = await fetch(`http://localhost:8080/user/logicDelete/${id}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!res.ok) {
                        throw new Error(`HTTP ${res.status}`);
                    }

                    // 更新本地状态
                    setUsers(users.filter(user => user.id !== id));
                    message.success("用户已逻辑删除");
                    
                    // 更新分页总数
                    setPagination(prev => ({
                        ...prev,
                        total: prev.total ? prev.total - 1 : 0
                    }));
                } catch (err) {
                    console.error(err);
                    message.error("删除用户失败");
                }
            }
        });
    };

    function handleAuth(id: number): void {
        throw new Error("Function not implemented.");
    }


    const columns: ColumnsType<User> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 60,
            fixed: 'left',
        },
        {
            title: "用户名",
            dataIndex: "username",
            key: "username",
            width: 100,
            fixed: 'left',
        },
        {
            title: "昵称",
            dataIndex: "nickname",
            key: "nickname",
            width: 160,
            fixed: 'left',
        },
        {
            title: "邮箱",
            dataIndex: "email",
            key: "email",
            width: 150,
        },
        {
            title: "手机号",
            dataIndex: "phone",
            key: "phone",
            width: 120,
        },
        {
            title: "头像",
            dataIndex: "avatar",
            key: "avatar",
            width: 60,
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            width: 80,
            render: (status: boolean) => (
                <span style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    border: `1px solid ${status ? '#52c41a' : '#ff4d4f'}`,
                    color: status ? '#52c41a' : '#ff4d4f'
                }}>
                    {status ? '正常' : '禁用'}
                </span>
            )
        },
        {
            title: "角色",
            dataIndex: "role",
            key: "role",
            width: 100,
            render: (role: string) => {
                return role === 'admin' ?
                    <Tag color="processing">管理员</Tag> :
                    <Tag color="default">普通用户</Tag>;
            }
        },
        {
            title: "最后登录",
            dataIndex: "lastLoginAt",
            key: "lastLoginAt",
            width: 160,
            render: (date: string) => date !== null ?
                dayjs(date).format('YYYY-MM-DD HH:mm:ss') : null,
        },
        {
            title: "创建时间",
            dataIndex: "gmtCreate",
            key: "gmtCreate",
            width: 160,
            render: (date: string) => date !== null ?
                dayjs(date).format('YYYY-MM-DD HH:mm:ss') : null,
        },
        {
            title: "更新时间",
            dataIndex: "gmtModified",
            key: "gmtModified",
            width: 160,
            render: (date: string) => date !== null ?
                dayjs(date).format('YYYY-MM-DD HH:mm:ss') : null,
        },
        {
            title: '操作',
            key: 'action',
            width: 180,
            fixed: 'right',
            render: (_, record: User) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        autoInsertSpace
                        onClick={() => handleEdit(record.id)}
                    >
                        编辑
                    </Button>
                    <Button
                        type="primary"
                        danger
                        autoInsertSpace
                        onClick={() => handleDelete(record.id)}
                    >
                        逻辑删除
                    </Button>
                    <Button
                        type="primary"
                        autoInsertSpace
                        onClick={() => handleAuth(record.id)}
                    >
                        授权
                    </Button>
                </Space>
            ),
        }
    ];

    return (
        <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
            <style>{`
                .even-row {
                    background-color: #fafafa;
                }
                .odd-row {
                    background-color: #ffffff; 
                }
                .even-row:hover, .odd-row:hover {
                    background-color: #f0f0f0 !important;
                }
            `}</style>
            <Space style={{ marginBottom: 16 }} align="baseline">
                <Space.Compact>
                    <span style={{ padding: '0 8px', lineHeight: '32px', background: '#f5f5f5', border: '1px solid #d9d9d9', borderRight: 'none', borderRadius: '6px 0 0 6px', width: 60, textAlign: 'center' }}>关键词</span>
                    <Input
                    placeholder="输入姓名搜索"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ width: 240 }}
                        allowClear
                    />
                </Space.Compact>
                <Space.Compact>
                    <span style={{ padding: '0 8px', lineHeight: '32px', background: '#f5f5f5', border: '1px solid #d9d9d9', borderRight: 'none', borderRadius: '6px 0 0 6px', width: 60, textAlign: 'center' }}>状态</span>
                    <Select
                        placeholder="选择状态"
                        value={status}
                        onChange={setStatus}
                        style={{ width: 240, height: 32 }}
                        allowClear
                    >
                        <Select.Option value={true}>正常</Select.Option>
                        <Select.Option value={false}>禁用</Select.Option>
                    </Select>
                </Space.Compact>
                <Space.Compact>
                    <span style={{ padding: '0 8px', lineHeight: '32px', background: '#f5f5f5', border: '1px solid #d9d9d9', borderRight: 'none', borderRadius: '6px 0 0 6px', width: 60, textAlign: 'center' }}>角色</span>
                    <Select
                        placeholder="选择角色"
                        value={role}
                        onChange={setRole}
                        style={{ width: 240, height: 32 }}
                        allowClear
                    >
                        <Select.Option value="user">普通用户</Select.Option>
                        <Select.Option value="admin">管理员</Select.Option>
                    </Select>
                </Space.Compact>
                <Button type="primary" onClick={handleSearch}>
                    搜索
                </Button>
            </Space>

            <UserEditModal
                visible={ editModalVisible }
                user={ currentUser }
                onCancel={() => setEditModalVisible(false)}
                onSave={ handleSaveUser }
                loading={ saveLoading }
            />

            <Table
                columns={ columns }
                dataSource={ users }
                loading={ loading }
                rowKey="id"
                scroll={{ x: 'max-content' }}
                rowClassName={(_, index) => index % 2 === 0 ? 'even-row' : 'odd-row'}
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`,
                }}
                onChange={handleTableChange}
            />
        </div>
    );
}

