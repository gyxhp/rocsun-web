import { Modal, Form, Input, Select, Button, message } from "antd";
import { useEffect } from "react";

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
}

interface UserEditModalProps {
    visible: boolean;
    user: User | null;
    onCancel: () => void;
    onSave: (user: User) => void;
    loading?: boolean;
}

export default function UserEditModal({ visible, user, onCancel, onSave, loading }: UserEditModalProps) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && user) {
            form.setFieldsValue(user);
        } else {
            form.resetFields();
        }
    }, [visible, user, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            onSave({ ...user, ...values });
        } catch (error) {
            message.error("表单验证失败");
        }
    };

    return (
        <Modal
            title={user ? "编辑用户" : "新增用户"}
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    取消
                </Button>,
                <Button key="save" type="primary" loading={loading} onClick={handleSave}>
                    保存
                </Button>,
            ]}
            width={600}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    status: true,
                    role: "user"
                }}
            >
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: "请输入用户名" }]}
                >
                    <Input placeholder="请输入用户名" />
                </Form.Item>

                <Form.Item
                    name="nickname"
                    label="昵称"
                >
                    <Input placeholder="请输入昵称" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                        { required: true, message: "请输入邮箱" },
                        { type: "email", message: "请输入有效的邮箱地址" }
                    ]}
                >
                    <Input placeholder="请输入邮箱" />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="手机号"
                >
                    <Input placeholder="请输入手机号" />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="状态"
                    rules={[{ required: true, message: "请选择状态" }]}
                >
                    <Select>
                        <Select.Option value={true}>正常</Select.Option>
                        <Select.Option value={false}>禁用</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="role"
                    label="角色"
                    rules={[{ required: true, message: "请选择角色" }]}
                >
                    <Select>
                        <Select.Option value="user">普通用户</Select.Option>
                        <Select.Option value="admin">管理员</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="avatar"
                    label="头像URL"
                >
                    <Input placeholder="请输入头像URL" />
                </Form.Item>
            </Form>
        </Modal>
    );
}