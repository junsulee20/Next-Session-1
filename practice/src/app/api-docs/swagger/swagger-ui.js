'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

/**
 * Swagger UI를 브라우저에 렌더링하는 클라이언트 컴포넌트입니다.
 * @param {object} spec - 부모 서버 컴포넌트(page.js)로부터 받은 API 명세서 객체
 */
export default function Swagger({ spec }) {
    // 전달받은 'spec' 객체를 사용하여 UI를 렌더링합니다.
    return <SwaggerUI spec={spec} />;
}
