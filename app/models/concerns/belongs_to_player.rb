# frozen_string_literal: true

# Common methods for "top-level" models - Characters, QCs, and Battlegroups
module BelongsToPlayer
  extend ActiveSupport::Concern
  included do
    belongs_to :player

    # TODO: validate that if a character is in a chronicle, the player must be too
    belongs_to :chronicle, optional: true
    delegate :storyteller, to: :chronicle
  end

  # avoid needing BattlegroupPolicy and QcPolicy
  module ClassMethods
    def policy_class
      CharacterPolicy
    end
  end
end
