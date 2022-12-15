class Api::V1::HaikuController < ApplicationController

  def create
    line1 = params[:line1]
    line2 = params[:line2]
    line3 = params[:line3]
    username = params[:username]
    haiku = Haiku.new({line1: line1, line2: line2, line3: line3, username: username, font: params[:font]})
    haiku.save!
    render json: {haiku: haiku.as_json_for_api}, status: :ok
  end

  def upvote
    haiku_id = params[:haiku_id]
    source = "#{request.env['HTTP_X_FORWARDED_HOST']}-#{request.env['HTTP_USER_AGENT']}"
    vote_check = Vote.where(haiku_id: haiku_id, source: source).last
    if vote_check
      if vote_check.direction == 'down'
        vote_check.direction = 'up'
        vote_check.save!
        render json: {haiku: haiku.reload.as_json_for_api}, status: :ok
      else
        render json: {error: 'Only one vote permitted per haiku'}, status: 422
      end
    end
    vote = Vote.new(haiku_id: haiku_id, direction: 'up', source: source)
    vote.save!
    haiku = Haiku.find(params[:haiku_id])
    render json: {haiku: haiku.as_json_for_api(request)}, status: :ok
  end

  def downvote
    haiku_id = params[:haiku_id]
    source = "#{request.env['HTTP_X_FORWARDED_HOST']}-#{request.env['HTTP_USER_AGENT']}"
    vote_check = Vote.where(haiku_id: haiku_id, source: source).last
    if vote_check
      if vote_check.direction == 'up'
        vote_check.direction = 'down'
        vote_check.save!
        render json: {haiku: haiku.reload.as_json_for_api}, status: :ok
      else
        render json: {error: 'Only one vote permitted per haiku'}, status: 422
      end
    end
    vote = Vote.new(haiku_id: haiku_id, direction: 'down', source: source)
    vote.save!
    haiku = Haiku.find(params[:haiku_id])
    render json: {haiku: haiku.as_json_for_api(request)}, status: :ok
  end

  def index
    render json: {haiku: Haiku.all.map{|x| x.as_json_for_api(request)}}, status: :ok
  end
end
