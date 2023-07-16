declare const _default: ({
    output: {
        file: string;
        name: string;
        format: string;
        sourcemap: boolean;
        amd: {
            id: string;
        };
    };
    input: string;
    external: string[];
    watch: {
        include: string;
    };
    plugins: any[];
} | {
    output: {
        file: string;
        format: string;
        sourcemap: boolean;
    }[];
    external: string[];
    plugins: any[];
    input: string;
    watch: {
        include: string;
    };
} | {
    output: {
        file: string;
        format: string;
        name: string;
        sourcemap: boolean;
        amd?: undefined;
    };
    input: string;
    external: string[];
    watch: {
        include: string;
    };
    plugins: any[];
})[];
export default _default;
