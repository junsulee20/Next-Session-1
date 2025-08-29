import swaggerJsdoc from 'swagger-jsdoc';
import SwaggerUI from './swagger-ui'; // UI 렌더링을 담당할 클라이언트 컴포넌트를 임포트합니다.

/**
 * 서버에서 실행되어 API 명세서('spec') 객체를 생성하는 함수입니다.
 */
function getSwaggerSpec() {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'notes API',
                version: '1.0.0',
                description: 'Swagger 간단 CRUD 실습 페이지입니다.',
            },
        },
        apis: ['./src/app/api/notes/**/*.js'],
    };

    return swaggerJsdoc(options);
}

/**
 * API 문서 페이지의 메인 서버 컴포넌트입니다.
 * 1. 서버에서 API 명세서('spec')를 생성합니다.
 * 2. 생성된 'spec'을 UI를 그릴 클라이언트 컴포넌트('SwaggerUI')에 전달합니다.
 */
export default async function ApiDocsPage() {
    const spec = getSwaggerSpec();
    return <SwaggerUI spec={spec} />;
}

// 1.	서버에서 page.js 실행 → Swagger 스펙(JSON) 생성.
// 2.	spec을 props로 swagger-ui.js에 전달.
// 3.	브라우저에서 swagger-ui.js 실행 → Swagger UI 화면이 렌더링됨.
