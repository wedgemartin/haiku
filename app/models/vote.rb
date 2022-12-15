class Vote
    include Mongoid::Document
    include Mongoid::Timestamps
    belongs_to :haiku
    field :direction  # up or down
    field :source
end
