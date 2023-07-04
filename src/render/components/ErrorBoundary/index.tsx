/**
 * Author: Moki
 * Date: 2023-07-04
 * FileName: 错误边界
 **/
import React, {ErrorInfo} from 'react';


type ErrorBoundaryProps = {
    onError?: (error: Error, stack: ErrorInfo) => void;
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

type ErrorBoundaryState = {
    hasError: boolean;
    errInfo: any
}
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            errInfo: null
        };
    }

    /**
     * Author: Moki
     * Date: 2023-01-27
     * Todo: 错误捕捉返回
     **/
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const {onError} = this.props;
        this.setState({
            hasError: true,
            errInfo: errorInfo
        });
        console.log(error);
        onError && onError(error, errorInfo);
    }


    render() {
        const {fallback} = this.props;
        const {hasError, errInfo} = this.state;
        if (hasError) {
            if (fallback && React.isValidElement(fallback)) {
                return fallback;
            }
            return (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <div>Err</div>
                </div>
            );
        }
        return this.props.children;
    }
}
