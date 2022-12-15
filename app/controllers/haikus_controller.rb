class HaikusController < ApplicationController
  before_action :set_haiku, only: %i[ show edit update destroy ]

  # GET /haikus
  def index
    @haikus = Haiku.all
  end

  # GET /haikus/1
  def show
  end

  # GET /haikus/new
  def new
    @haiku = Haiku.new
  end

  # GET /haikus/1/edit
  def edit
  end

  # POST /haikus
  def create
    @haiku = Haiku.new(haiku_params)

    if @haiku.save
      redirect_to @haiku, notice: "Haiku was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /haikus/1
  def update
    if @haiku.update(haiku_params)
      redirect_to @haiku, notice: "Haiku was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /haikus/1
  def destroy
    @haiku.destroy
    redirect_to haikus_url, notice: "Haiku was successfully destroyed."
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_haiku
      @haiku = Haiku.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def haiku_params
      params.require(:haiku).permit(:username, :line1, :line2, :line3)
    end
end
