
export type ReviewProps = {
    product_id?: number;
    account_id?: number;
    category_id: number;
    score?: number;
    comment?: string;
    reply?: string;
    status?: string;
    helpful?:number;
    id?: number;
}
import { Review } from "@kidztime/models/ugc";
import { transact } from "@kidztime//models";
import { GenericOpts } from "../types";
import { Sequelize } from "sequelize";


export const create_review =  async (props: ReviewProps, opts: GenericOpts = {}) => {
    const res = await transact(opts.transaction).run(async (transaction) => {
        const review = await Review.create(props, { transaction })
        return review
    });
    return res
}

export const helpful_review =  async (props: Review, opts: GenericOpts = {}) => {
    const res = await transact(opts.transaction).run(async (transaction) => {
        const review = await props.update({
                helpful: (props.helpful || 0) + 1
            },
            {transaction}
        )
        return review
    });
    return res
}
export const dislike_review =  async (props: Review, opts: GenericOpts = {}) => {
    const res = await transact(opts.transaction).run(async (transaction) => {
        const review = await props.update({
                dislike: (props.dislike || 0) + 1
            },
            {transaction}
        )
        return review
    });
    return res
}

export const update_review =  async (review: Review, props: ReviewProps, opts: GenericOpts = {}) => {
    const res = await transact(opts.transaction).run(async (transaction) => {
        const updated_review = await review.update(
            {
                ...props
            },
            { transaction }
        )
        return updated_review
    });
    return res
}

export const get_product_avg_rating =  async (product_type_id: number, opts: GenericOpts = {}) => {
    const res = await transact(opts.transaction).run(async (transaction) => {
        const result = await Review.findOne({
          transaction,  
          where: {
            product_type_id,
            status: Review.STATUS.published,
            deleted_at: null
          },
          attributes: [
            [Sequelize.fn('AVG', Sequelize.col('score')), 'average'],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          ],
        });

        return result
    });
    return res
}
