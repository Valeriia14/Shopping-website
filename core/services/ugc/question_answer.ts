
export type QuestionAnswerProps = {
    product_id?: number;
    account_id?: number;
    category_id?: number;
    question?: string;
    answer?: string;
    type?: string;  
    status?: string;
}
import { QuestionAnswer } from "@kidztime/models/ugc";
import { transact } from "@kidztime//models";
import { GenericOpts } from "../types";

export const create_question_answer =  async (props: QuestionAnswerProps, opts: GenericOpts = {}) => {
    const res = await transact(opts.transaction).run(async (transaction) => {
       return await QuestionAnswer.create(props, { transaction })
    });
    return res
}

export const update_question_answer =  async (qa: QuestionAnswer, props: QuestionAnswerProps, opts: GenericOpts = {}) => {
    const res = await transact(opts.transaction).run(async (transaction) => {
        const updated_qa = await qa.update(
            {
                ...props
            },
            { transaction }
        )
        return updated_qa
    });
    return res
}