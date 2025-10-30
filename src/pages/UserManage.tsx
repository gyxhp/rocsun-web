import { Button, Input, message, Space, Table, Tag, type TablePaginationConfig } from "antd";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
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
    const [search, setSearch] = useState<string>()
    const [username, setUsername] = useState<string>()
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

    function handleEdit(id: number): void {
        throw new Error("Function not implemented.");
    }

    function handleDelete(id: number): void {
        throw new Error("Function not implemented.");
    }

    function handleAuth(id: number): void {
        throw new Error("Function not implemented.");
    }


    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 80,
        },
        {
            title: "用户名",
            dataIndex: "username",
            key: "username",
            width: 120,
        },
        {
            title: "昵称",
            dataIndex: "nickname",
            key: "nickname",
            width: 100,
        },
        {
            title: "邮箱",
            dataIndex: "email",
            key: "email",
            width: 180,
        },
        {
            title: "手机号",
            dataIndex: "phone",
            key: "phone",
            width: 130,
        },
        {
            title: "头像",
            dataIndex: "avatar",
            key: "avatar",
            width: 80,
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
            ),
            filters: [
                { text: '正常', value: true },
                { text: '禁用', value: false },
            ]
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
            },
            filters: [
                { text: '普通用户', value: 'user' },
                { text: '管理员', value: 'admin' },
            ],
        },
        {
            title: "最后登录",
            dataIndex: "lastLoginAt",
            key: "lastLoginAt",
            width: 180,
            render: (date: string) => date !== null ?
                dayjs(date).format('YYYY-MM-DD HH:mm:ss') : null,
        },
        {
            title: "创建时间",
            dataIndex: "gmtCreate",
            key: "gmtCreate",
            width: 180,
            render: (date: string) => date !== null ?
                dayjs(date).format('YYYY-MM-DD HH:mm:ss') : null,
        },
        {
            title: "更新时间",
            dataIndex: "gmtModified",
            key: "gmtModified",
            width: 180,
            render: (date: string) => date !== null ?
                dayjs(date).format('YYYY-MM-DD HH:mm:ss') : null,
        },
        {
            title: '操作',
            key: 'action',
            width: 100,
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
            <h2 style={{ marginBottom: 16 }}>用户管理</h2>

            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="输入姓名或邮箱搜索"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 240 }}
                    allowClear
                />
                <Button type="primary" onClick={handleSearch}>
                    搜索
                </Button>
            </Space>

            <Table
                columns={columns}
                dataSource={users}
                loading={loading}
                rowKey="id"
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

