# 🔗 Crypto Analysis Board - 加密货币分析面板

> 一个基于 React + TypeScript + Zustand 的现代化加密货币交易分析和可视化平台

## 📋 项目概述

Crypto Analysis Board 是一个专业的加密货币分析工具，提供区块链交易可视化、地址分析、风险评估等功能。项目采用现代化的前端架构，注重代码质量、类型安全和开发体验。

### ✨ 主要功能

- 🎨 **可视化画布** - 交互式节点图表展示交易关系
- 🏷️ **地址管理** - 地址标记、分类和属性编辑
- 🎛️ **工作区** - 灵活的面板布局和数据导出
- 📊 **数据分析** - 节点关系分析和结构展示
- 🔍 **区块链查询** - 支持多链地址查询和交易分析 (开发中)
- 📈 **智能分析** - 路径分析、集群分析、风险评估 (计划中)

### 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **状态管理**: Zustand
- **UI 组件**: Radix UI + Tailwind CSS
- **数据可视化**: D3.js
- **API 通信**: 待配置 (计划使用 tRPC + React Query)
- **构建工具**: Vite
- **代码规范**: ESLint + TypeScript

> **注意**: tRPC 和 React Query 依赖已安装但尚未完全配置。当前项目使用模拟数据进行开发。

## 🏗️ 架构设计

### 核心设计原则

1. **模块化** - 按功能领域组织代码
2. **分层清晰** - UI、业务逻辑、数据层职责分离
3. **类型安全** - 全面的 TypeScript 类型定义
4. **状态集中** - 使用 Zustand 进行状态管理
5. **可复用性** - 组件和逻辑的高度复用

### 目录结构

```
src/
├── components/                     # 纯UI组件层
│   ├── ui/                        # 基础UI组件 (shadcn/ui)
│   ├── common/                    # 通用业务组件
│   └── layout/                    # 布局组件
│
├── features/                      # 功能模块层
│   ├── canvas/                  # 画布功能模块
│   │   ├── index.tsx            # 模块统一入口
│   │   ├── components/           # 功能特定展示组件
│   │   ├── widgets/             # 画布组件(含业务逻辑)
│   │   ├── hooks/               # 功能特定hooks
│   │   ├── services/            # 业务逻辑服务
│   │   └── types/               # 类型定义
│   ├── property/                # 属性编辑模块
│   └── workspace/               # 工作区模块
│       ├── index.tsx            # 工作区统一入口(布局容器)
│       ├── widgets/             # 布局容器组件
│       │   ├── LeftPanel.tsx    # 左侧面板容器
│       │   ├── RightPanel.tsx   # 右侧面板容器
│       │   └── TopToolbar.tsx   # 顶部工具栏容器
│       ├── components/          # 功能组件
│       │   ├── JsonDataPanel.tsx # JSON数据面板
│       │   ├── StylePanel.tsx   # 样式面板
│       │   ├── PropertyEditor.tsx # 属性编辑器
│       │   ├── AddressPropertyEditor.tsx # 地址属性编辑器
│       │   ├── EdgeLibrary.tsx  # 边组件库
│       │   ├── NodeLibrary.tsx  # 节点组件库
│       │   └── StructureOverview.tsx # 结构总览
│       └── (hooks/)             # 工作区hooks (可选)
│
├── shared/                      # 共享资源层
│   ├── components/              # 跨功能共享组件
│   │   ├── modals/              # 模态框组件
│   │   ├── forms/               # 表单组件
│   │   └── data-display/        # 数据展示组件
│   ├── hooks/                   # 通用hooks
│   ├── utils/                   # 工具函数
│   │   ├── index.ts             # 统一导出入口
│   │   ├── classNames.ts        # 类名合并工具(cn函数)
│   │   ├── addressUtils.ts      # 地址处理工具
│   │   ├── layoutAlgorithms.ts  # 布局算法
│   │   └── sampleData.ts        # 示例数据
│   ├── storage/                 # 存储工具
│   ├── services/               # API服务
│   │   └── api/                # API相关服务
│   └── types/                  # 全局类型定义
│
├── store/                      # 状态管理层
│   ├── slices/                 # Store切片
│   ├── middleware/             # Store中间件
│   └── index.ts               # Store入口
│
├── providers/                 # Context Providers
├── lib/                      # 第三方库配置
└── assets/                   # 静态资源
```

### 分层说明

#### 🎨 Components Layer (组件层)

```typescript
// 纯UI组件 - 无状态、可复用
components / ui / Button.tsx;
components / common / LoadingSpinner.tsx;
```

#### 🔧 Features Layer (功能层)

```typescript
// 功能模块 - 按业务领域组织
features / workspace / index.tsx;                 // 工作区布局容器
features / workspace / widgets / LeftPanel.tsx;   // 布局组件
features / workspace / components / PropertyEditor.tsx; // 功能组件
features / canvas / index.tsx;                    // 画布模块入口
features / canvas / widgets / CentralCanvas.tsx;  // 画布实现
features / canvas / hooks / useCanvasDrag.ts;     // 画布hooks
```

#### 🌐 Shared Layer (共享层)

```typescript
// 跨功能共享资源
shared / hooks / useDebounce.ts;
shared / utils / addressUtils.ts;
shared / storage / localStorage.ts;
shared / services / api / client.ts;
shared / types / common.ts;
```

#### 🗃️ Store Layer (状态层)

```typescript
// 集中状态管理
store / slices / canvasSlice.ts;
store / slices / modalSlice.ts;
store / slices / uiSlice.ts;
```

### 🔄 最新架构优化

#### Shared 层重新设计
- **utils** - 统一的工具函数目录，包含 UI 类名处理、地址工具、布局算法等，不再隶属于 services
- **storage** - 存储相关工具独立管理，包含 localStorage、sessionStorage 等
- **services/api** - 专注于 API 相关服务，保持职责单一

#### 优化原则
- **职责分离**: utils 和 storage 作为纯工具层，与业务服务分离
- **依赖清晰**: 减少层级嵌套，提高模块查找效率
- **可维护性**: 更直观的目录结构，便于团队协作

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装和启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 预览构建结果
npm run preview
```

### 开发环境配置

```bash
# 复制环境变量配置文件
cp .env.example .env.local

# 编辑环境变量
# VITE_API_URL=your_api_url
# VITE_ETHERSCAN_API_KEY=your_etherscan_key
```

> **当前状态**: 项目目前使用模拟数据进行开发。API 集成将在后续版本中完成。

## 📖 开发指南

### 组件开发规范

#### 1. 纯 UI 组件 (Pure Components)

```typescript
// ✅ 好的例子 - 纯UI组件
interface ButtonProps {
  variant: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  onClick,
}) => {
  return (
    <button className={getButtonStyles(variant)} onClick={onClick}>
      {children}
    </button>
  );
};
```

#### 2. 容器组件 (Container Components)

```typescript
// ✅ 好的例子 - 容器组件
export const PropertyEditor: React.FC = () => {
  const { selectedNodes } = useCanvasStore();
  const { editNode } = useNodeEditor();

  return (
    <PropertyForm nodes={selectedNodes} onEdit={editNode} />
  );
};
```

### 状态管理规范

#### 1. Store 切片设计

```typescript
// ✅ 好的例子 - 清晰的状态切片
interface CanvasState {
  // 状态
  nodes: CryptoNode[];
  edges: CryptoEdge[];
  selectedNodes: string[];

  // 操作
  addNode: (node: CryptoNode) => void;
  updateNode: (id: string, updates: Partial<CryptoNode>) => void;
  selectNode: (id: string) => void;
}
```

#### 2. 自定义 Hooks

```typescript
// ✅ 好的例子 - 封装业务逻辑
export const useNodeSelection = () => {
  const { selectedNodes, selectNode, clearSelection } = useCanvasStore();

  const selectMultiple = useCallback(
    (nodeIds: string[]) => {
      nodeIds.forEach(selectNode);
    },
    [selectNode]
  );

  return { selectedNodes, selectMultiple, clearSelection };
};
```

### 文件命名规范

```
PascalCase  - 组件文件         Button.tsx
camelCase   - hooks文件        useBlockchainQuery.ts
camelCase   - 服务文件         blockchainApi.ts
camelCase   - 工具文件         addressUtils.ts
kebab-case  - 样式文件         button.module.css
UPPER_CASE  - 常量文件         API_ENDPOINTS.ts
```

### 导入顺序规范

```typescript
// 1. React相关
import React, { useState, useEffect } from "react";

// 2. 第三方库
import { toast } from "react-hot-toast";
import * as d3 from "d3";

// 3. 内部组件
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

// 4. 功能模块
import { useCanvasStore } from "@/features/canvas/store";
import { layoutAlgorithms } from "@/features/canvas/services";

// 5. 共享资源
import { useDebounce } from "@/shared/hooks";
import { formatAddress, cn } from "@/shared/utils";

// 6. 类型定义
import type { CryptoNode } from "@/shared/types";
```

## 🔄 迁移计划

项目正在从传统的组件结构迁移到新的分层架构：

### 阶段 1: 基础重构 ✅

- [x] 创建 Zustand 状态管理
- [x] 迁移核心组件状态
- [x] 建立基础 Store 结构

### 阶段 2: 模块化重构 ✅

- [x] 重组目录结构
- [x] 功能模块拆分  
- [x] 建立模块接口
- [x] 优化 Shared 层架构（utils 和 storage 独立）

### 阶段 3: 业务逻辑分离 📋

- [ ] 提取业务逻辑到 Services
- [ ] 创建自定义 Hooks
- [ ] 优化组件职责
- [ ] 配置 tRPC 服务器和客户端
- [ ] 集成 React Query 进行数据管理

## 🤝 贡献指南

### 提交规范

使用 [约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 格式：

```
feat: 新增 feature
fix: 修复 bug
docs: 仅仅修改了文档
style: 仅仅修改了空格、格式缩进、逗号等
refactor: 代码重构，没有加新功能或者修复 bug
perf: 优化相关，比如提升性能、体验
test: 测试用例，包括单元测试、集成测试等
chore: 改变构建流程、或者增加依赖库、工具等
revert: 回滚到上一个版本
```

### 开发流程

1. **创建分支**: `git checkout -b feature/your-feature-name`
2. **开发功能**: 遵循代码规范和架构设计
3. **提交代码**: 使用规范的 commit message
4. **创建 PR**: 提供清晰的描述和测试说明
5. **代码审查**: 等待 Review 和合并

### 代码质量检查

```bash
# 类型检查
npm run type-check

# 代码格式化
npm run format

# 代码检查
npm run lint

# 运行测试
npm run test
```

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持和反馈

- 🐛 **Bug 报告**: [Issues](https://github.com/your-org/binflow/issues)
- 💡 **功能请求**: [Discussions](https://github.com/your-org/binflow/discussions)
- 📧 **邮件联系**: your-email@example.com

---

**Crypto Analysis Board** - 让加密货币分析更简单、更直观 🚀
